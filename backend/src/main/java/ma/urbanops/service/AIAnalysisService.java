package ma.urbanops.service;

import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.response.AIAnalysisResponse;
import ma.urbanops.enums.Severity;
import ma.urbanops.exception.AIAnalysisException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Slf4j
@Service
public class AIAnalysisService {

    @Value("${ai.gemini.api-key}")
    private String apiKey;

    @Value("${ai.gemini.endpoint}")
    private String apiEndpoint;

    @Value("${ai.gemini.timeout:30000}")
    private int timeout;

    private final RestTemplate restTemplate = new RestTemplate();

    public AIAnalysisResponse analyzeIncident(String description, String base64Image, String categoryHint) {
        log.info("Analyzing incident with AI...");
        
        try {
            String prompt = buildAnalysisPrompt(description, categoryHint);
            
            // Build request body for Gemini API
            Map<String, Object> requestBody = buildGeminiRequest(prompt, base64Image);
            
            HttpHeaders headers = new HttpHeaders();
            headers.set("Content-Type", "application/json");
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);
            
            String url = apiEndpoint + "?key=" + apiKey;
            ResponseEntity<Map> response = restTemplate.exchange(url, HttpMethod.POST, entity, Map.class);
            
            String aiResponse = extractTextFromGeminiResponse(response.getBody());
            log.debug("AI raw response: {}", aiResponse);
            
            return parseAIResponse(aiResponse);
            
        } catch (Exception e) {
            log.error("AI analysis failed: {}", e.getMessage());
            // Return fallback response with MEDIUM severity
            return AIAnalysisResponse.builder()
                    .category(categoryHint != null ? categoryHint : "Unknown")
                    .severity(Severity.MEDIUM)
                    .reason("AI analysis failed, defaulting to medium severity")
                    .summary("Analysis unavailable")
                    .rawResponse(e.getMessage())
                    .build();
        }
    }

    private String buildAnalysisPrompt(String description, String categoryHint) {
        return String.format("""
            You are an AI assistant for an urban supervision system in Marrakech, Morocco.
            
            Analyze the following urban incident description and determine:
            1. The most appropriate category (Transport, Eau, Déchets, Éclairage, Électricité, Voirie, Sécurité, Espaces verts)
            2. The severity level (HIGH, MEDIUM, or LOW) based on urgency and danger
            3. The authority to alert (Police, ONEE, RADEEMA, or Commune)
            4. A brief reason for the classification
            5. A summary of the incident
            
            Incident description: %s
            Hint category: %s
            
            Respond ONLY with a JSON object in this exact format:
            {
                "category": "<category>",
                "severity": "<HIGH|MEDIUM|LOW>",
                "reason": "<reason>",
                "authority": "<Police|ONEE|RADEEMA|Commune>",
                "summary": "<summary>"
            }
            """, description, categoryHint != null ? categoryHint : "Not specified");
    }

    private Map<String, Object> buildGeminiRequest(String prompt, String base64Image) {
        Map<String, Object> textPart = Map.of("text", prompt);
        
        List<Map<String, Object>> parts;
        if (base64Image != null && !base64Image.isEmpty()) {
            Map<String, Object> imagePart = Map.of(
                    "inline_data", Map.of(
                            "mime_type", "image/jpeg",
                            "data", base64Image
                    )
            );
            parts = List.of(textPart, imagePart);
        } else {
            parts = List.of(textPart);
        }
        
        return Map.of("contents", List.of(Map.of("parts", parts)));
    }

    private String extractTextFromGeminiResponse(Map<String, Object> response) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) response.get("candidates");
            if (candidates == null || candidates.isEmpty()) {
                throw new AIAnalysisException("No candidates in AI response");
            }
            
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            
            StringBuilder text = new StringBuilder();
            for (Map<String, Object> part : parts) {
                if (part.containsKey("text")) {
                    text.append(part.get("text"));
                }
            }
            
            return text.toString();
        } catch (Exception e) {
            throw new AIAnalysisException("Failed to parse AI response", e);
        }
    }

    private AIAnalysisResponse parseAIResponse(String aiResponse) {
        try {
            // Extract JSON from response
            Pattern pattern = Pattern.compile("\\{[^}]*\\}");
            Matcher matcher = pattern.matcher(aiResponse);
            
            if (!matcher.find()) {
                throw new AIAnalysisException("No JSON found in AI response");
            }
            
            String json = matcher.group();
            
            // Simple JSON parsing (in production, use a proper JSON parser)
            Map<String, String> result = parseSimpleJson(json);
            
            return AIAnalysisResponse.builder()
                    .category(result.getOrDefault("category", "Unknown"))
                    .severity(mapSeverityFromAI(result.getOrDefault("severity", "MEDIUM")))
                    .reason(result.getOrDefault("reason", "No reason provided"))
                    .authorityToAlert(result.getOrDefault("authority", "Commune"))
                    .summary(result.getOrDefault("summary", "No summary"))
                    .rawResponse(aiResponse)
                    .build();
                    
        } catch (Exception e) {
            log.error("Failed to parse AI response: {}", e.getMessage());
            return AIAnalysisResponse.builder()
                    .category("Unknown")
                    .severity(Severity.MEDIUM)
                    .reason("Failed to parse AI response: " + e.getMessage())
                    .summary("Analysis unavailable")
                    .rawResponse(aiResponse)
                    .build();
        }
    }

    private Map<String, String> parseSimpleJson(String json) {
        Map<String, String> result = new java.util.HashMap<>();
        
        json = json.replaceAll("[{}\"]", "");
        String[] pairs = json.split(",");
        
        for (String pair : pairs) {
            String[] keyValue = pair.split(":", 2);
            if (keyValue.length == 2) {
                result.put(keyValue[0].trim(), keyValue[1].trim());
            }
        }
        
        return result;
    }

    public Severity mapSeverityFromAI(String aiSeverity) {
        if (aiSeverity == null) {
            return Severity.MEDIUM;
        }
        
        String normalized = aiSeverity.toUpperCase().trim();
        
        return switch (normalized) {
            case "HIGH" -> Severity.HIGH;
            case "LOW" -> Severity.LOW;
            case "MEDIUM", "MED" -> Severity.MEDIUM;
            default -> {
                log.warn("Unknown severity from AI: {}, defaulting to MEDIUM", aiSeverity);
                yield Severity.MEDIUM;
            }
        };
    }

    public String buildAnalysisPrompt(String description) {
        return buildAnalysisPrompt(description, null);
    }
}
