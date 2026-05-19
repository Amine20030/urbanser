package ma.urbanops.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.urbanops.dto.response.AIAnalysisResult;
import ma.urbanops.dto.response.ContentModerationResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AIAnalysisServiceGeminiTest {

    @Mock private RestTemplate restTemplate;

    private AIAnalysisService service;

    @BeforeEach
    void setUp() {
        service = new AIAnalysisService(restTemplate, new ObjectMapper());
        ReflectionTestUtils.setField(service, "apiKey", "test-api-key");
        ReflectionTestUtils.setField(service, "endpoint", "https://example.com/gemini");
    }

    @Test
    void analyze_withGeminiResponse_shouldParseJson() {
        String json = """
            {"category":"Eau","severity":"HIGH","authorityName":"RADEEMA",
            "authorityEmail":"urgences@radeema.ma","reason":"Fuite","confidence":0.9}
            """;
        Map<String, Object> body = Map.of(
                "candidates", List.of(Map.of(
                        "content", Map.of(
                                "parts", List.of(Map.of("text", json))
                        )
                ))
        );
        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                any(ParameterizedTypeReference.class)))
                .thenReturn(ResponseEntity.ok(body));

        AIAnalysisResult result = service.analyze("fuite d'eau dans la rue", "Eau");

        assertEquals("HIGH", result.getSeverity());
        assertEquals("RADEEMA", result.getAuthorityName());
        assertFalse(result.getFallbackUsed());
    }

    @Test
    void moderateIncidentContent_withGeminiResponse_shouldParseJson() {
        String json = """
            {"accepted":true,"reason":"Contenu valide","confidence":0.95}
            """;
        Map<String, Object> body = Map.of(
                "candidates", List.of(Map.of(
                        "content", Map.of(
                                "parts", List.of(Map.of("text", json))
                        )
                ))
        );
        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                any(ParameterizedTypeReference.class)))
                .thenReturn(ResponseEntity.ok(body));

        ContentModerationResult result = service.moderateIncidentContent(
                "Fuite d'eau",
                "Fuite d'eau importante dans la rue principale du quartier",
                "Eau",
                "Gueliz");

        assertEquals(Boolean.TRUE, result.getAccepted());
        assertFalse(result.getFallbackUsed());
    }

    @Test
    void analyze_withInvalidGeminiStructure_shouldThrow() {
        when(restTemplate.exchange(
                any(String.class),
                eq(HttpMethod.POST),
                any(HttpEntity.class),
                any(ParameterizedTypeReference.class)))
                .thenReturn(ResponseEntity.ok(Map.of("candidates", List.of())));

        AIAnalysisResult result = service.analyze("fuite d'eau dans la rue", "Eau");

        assertTrue(result.getFallbackUsed());
    }
}
