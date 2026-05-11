package ma.urbanops.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.response.AIAnalysisResult;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AIAnalysisService {

    @Value("${ai.gemini.api-key:}")
    private String apiKey;

    @Value("${ai.gemini.endpoint:https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent}")
    private String endpoint;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public AIAnalysisService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    // ── MAIN ENTRY POINT ─────────────────────────────────────
    // NEVER throws — always returns a result (real or fallback)
    public AIAnalysisResult analyze(String description, String categoryHint) {
        if (apiKey == null || apiKey.isBlank() || apiKey.equals("YOUR_GEMINI_API_KEY")) {
            log.warn("Gemini API key not configured — using fallback");
            return fallback(description, categoryHint);
        }
        try {
            return callGemini(description, categoryHint);
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            if (e.getStatusCode().value() == 429) {
                log.warn("Gemini rate limit hit, retrying in 3s...");
                try {
                    Thread.sleep(3000);
                    return callGemini(description, categoryHint);
                } catch (Exception e2) {
                    return fallback(description, categoryHint);
                }
            }
            return fallback(description, categoryHint);
        } catch (Exception e) {
            log.warn("Gemini call failed ({}), using fallback", e.getMessage());
            return fallback(description, categoryHint);
        }
    }

    // ── GEMINI CALL ───────────────────────────────────────────
    private AIAnalysisResult callGemini(String description, String categoryHint) {
        String prompt = buildPrompt(description, categoryHint);

        Map<String, Object> part = Map.of("text", prompt);
        Map<String, Object> content = Map.of("parts", List.of(part));
        Map<String, Object> genConfig = Map.of(
            "temperature", 0.1,
            "maxOutputTokens", 300,
            "responseMimeType", "application/json"
        );
        Map<String, Object> body = Map.of(
            "contents", List.of(content),
            "generationConfig", genConfig
        );

        String url = endpoint + "?key=" + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        ResponseEntity<Map> response = restTemplate.exchange(
            url, HttpMethod.POST,
            new HttpEntity<>(body, headers),
            Map.class
        );

        String text = extractText(response.getBody());
        return parseResponse(text, categoryHint);
    }

    // ── PROMPT ────────────────────────────────────────────────
    private String buildPrompt(String description, String categoryHint) {
        return """
            Tu es un système expert d'analyse d'incidents urbains pour Marrakech, Maroc.
            Analyse cet incident et réponds UNIQUEMENT en JSON valide, sans texte avant ou après.

            DESCRIPTION: "%s"
            CATÉGORIE SUGGÉRÉE: %s

            RÈGLES:
            - severity: "HIGH" si danger immédiat (câble exposé, gaz, accident), "MEDIUM" si sérieux, "LOW" si gêne
            - En cas de doute HIGH vs MEDIUM → choisir HIGH (précaution)
            - category: Transport | Eau | Déchets | Éclairage | Électricité | Voirie | Sécurité | Espaces_Verts

            AUTORITÉS:
            Transport→Police Circulation | Eau→RADEEMA | Déchets→Commune | Éclairage→Commune
            Électricité→ONEE | Voirie→Travaux Publics | Sécurité→Police Nationale | Espaces_Verts→Commune

            Réponds avec exactement ce JSON:
            {"category":"...","severity":"...","authorityName":"...","authorityEmail":"...","reason":"...","confidence":0.0}
            """.formatted(description, categoryHint);
    }

    // ── PARSE ─────────────────────────────────────────────────
    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> body) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) body.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            throw new RuntimeException("Cannot parse Gemini response structure");
        }
    }

    private AIAnalysisResult parseResponse(String json, String categoryHint) {
        try {
            String clean = json.replaceAll("```json", "").replaceAll("```", "").trim();
            Map<String, Object> map = objectMapper.readValue(clean, Map.class);

            String severity = normalizeSeverity((String) map.get("severity"));

            return AIAnalysisResult.builder()
                .category(getString(map, "category", categoryHint))
                .severity(severity)
                .authorityName(getString(map, "authorityName", "Commune Marrakech"))
                .authorityEmail(getString(map, "authorityEmail", "contact@commune.marrakech.ma"))
                .reason(getString(map, "reason", "Analyse automatique"))
                .confidence(getDouble(map, "confidence", 0.8))
                .fallbackUsed(false)
                .rawResponse(json)
                .build();
        } catch (Exception e) {
            log.warn("Failed to parse Gemini JSON: {}", e.getMessage());
            return fallback(json, categoryHint);
        }
    }

    // ── FALLBACK — keyword rules ───────────────────────────────
    public AIAnalysisResult fallback(String description, String categoryHint) {
        String desc = description == null ? "" : description.toLowerCase();

        String severity = "MEDIUM";
        String authority = "Commune Urbaine Marrakech";
        String email = "contact@commune.marrakech.ma";
        String reason = "Classification automatique par règles métier";

        if (containsAny(desc, "câble","électrique","haute tension","électrocution","court-circuit")) {
            severity = "HIGH"; authority = "ONEE Marrakech"; email = "urgences.elec@onee.ma";
        } else if (containsAny(desc, "accident","blessé","agression","mort","feu","incendie")) {
            severity = "HIGH"; authority = "Police Nationale"; email = "police@marrakech.ma";
        } else if (containsAny(desc, "inondation","fuite","rupture","gaz")) {
            severity = "HIGH"; authority = "RADEEMA"; email = "urgences@radeema.ma";
        } else if (containsAny(desc, "embouteillage","trafic","route bloquée","signalisation")) {
            severity = "MEDIUM"; authority = "Police Circulation"; email = "circulation@marrakech.ma";
        } else if (containsAny(desc, "lampadaire","éclairage","lumière")) {
            severity = "MEDIUM";
        } else if (containsAny(desc, "poubelle","ordures","déchet")) {
            severity = "LOW";
        }

        return AIAnalysisResult.builder()
            .category(categoryHint != null ? categoryHint : "Voirie")
            .severity(severity)
            .authorityName(authority)
            .authorityEmail(email)
            .reason(reason)
            .confidence(0.5)
            .fallbackUsed(true)
            .rawResponse("fallback")
            .build();
    }

    // ── HELPERS ───────────────────────────────────────────────
    private String normalizeSeverity(String s) {
        if (s == null) return "MEDIUM";
        return switch (s.toUpperCase().trim()) {
            case "HIGH", "HAUTE", "ÉLEVÉ" -> "HIGH";
            case "LOW", "FAIBLE", "BAS"   -> "LOW";
            default                         -> "MEDIUM";
        };
    }

    private boolean containsAny(String text, String... keywords) {
        String normalized = java.text.Normalizer
            .normalize(text.toLowerCase(), java.text.Normalizer.Form.NFD)
            .replaceAll("\\p{M}", "");
        for (String k : keywords) {
            String normalizedKeyword = java.text.Normalizer
                .normalize(k.toLowerCase(), java.text.Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "");
            if (normalized.contains(normalizedKeyword)) return true;
        }
        return false;
    }

    private String getString(Map<String, Object> m, String key, String def) {
        Object v = m.get(key);
        return (v instanceof String s && !s.isBlank()) ? s : def;
    }

    private Double getDouble(Map<String, Object> m, String key, Double def) {
        try { return ((Number) m.get(key)).doubleValue(); }
        catch (Exception e) { return def; }
    }
}
