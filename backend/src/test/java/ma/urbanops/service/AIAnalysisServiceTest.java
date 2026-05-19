package ma.urbanops.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.urbanops.dto.response.AIAnalysisResult;
import ma.urbanops.dto.response.ContentModerationResult;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AIAnalysisServiceTest {

    private final AIAnalysisService service = new AIAnalysisService(null, new ObjectMapper());

    @Test
    void fallbackModeration_whenTextHasNoUrbanProblem_shouldReject() {
        ContentModerationResult result = service.fallbackModeration(
                "is not is you",
                "be as incident");

        assertNotEquals(Boolean.TRUE, result.getAccepted());
    }

    @Test
    void fallbackModeration_whenTextDescribesUrbanProblem_shouldAccept() {
        ContentModerationResult result = service.fallbackModeration(
                "Fuite d'eau devant la maison",
                "Il y a une fuite d'eau importante dans la rue principale");

        assertEquals(Boolean.TRUE, result.getAccepted());
    }

    @Test
    void analyze_withoutApiKey_shouldUseFallback() {
        AIAnalysisResult result = service.analyze("fuite d'eau dans la rue", "Eau");
        assertNotNull(result);
        assertTrue(result.getFallbackUsed());
    }

    @Test
    void fallback_electricalKeywords_shouldSetHighSeverity() {
        AIAnalysisResult result = service.fallback("câble électrique exposé danger", "Électricité");
        assertEquals("HIGH", result.getSeverity());
        assertEquals("ONEE Marrakech", result.getAuthorityName());
    }

    @Test
    void fallback_trafficKeywords_shouldSetMediumSeverity() {
        AIAnalysisResult result = service.fallback("embouteillage route bloquée", "Transport");
        assertEquals("MEDIUM", result.getSeverity());
        assertEquals("Police Circulation", result.getAuthorityName());
    }

    @Test
    void fallback_garbageKeywords_shouldSetLowSeverity() {
        AIAnalysisResult result = service.fallback("poubelle pleine ordures", "Déchets");
        assertEquals("LOW", result.getSeverity());
    }

    @Test
    void fallback_nullDescription_shouldNotThrow() {
        AIAnalysisResult result = service.fallback(null, null);
        assertNotNull(result);
        assertEquals("MEDIUM", result.getSeverity());
        assertEquals("Voirie", result.getCategory());
    }

    @Test
    void fallback_shortModerationText_shouldReject() {
        ContentModerationResult result = service.fallbackModeration("test", "court");
        assertNotEquals(Boolean.TRUE, result.getAccepted());
    }

    @Test
    void moderateIncidentContent_withoutApiKey_shouldUseLocalFallback() {
        ContentModerationResult result = service.moderateIncidentContent(
                "Fuite d'eau",
                "Fuite d'eau importante dans la rue principale du quartier",
                "Eau",
                "Gueliz");
        assertNotNull(result);
        assertEquals(Boolean.TRUE, result.getAccepted());
    }

    @Test
    void fallback_accidentKeywords_shouldSetHighSeverity() {
        AIAnalysisResult result = service.fallback("accident grave blessé", "Sécurité");
        assertEquals("HIGH", result.getSeverity());
        assertEquals("Police Nationale", result.getAuthorityName());
    }

    @Test
    void fallback_floodKeywords_shouldSetHighSeverity() {
        AIAnalysisResult result = service.fallback("inondation fuite importante", "Eau");
        assertEquals("HIGH", result.getSeverity());
        assertEquals("RADEEMA", result.getAuthorityName());
    }

    @Test
    void fallback_lightingKeywords_shouldKeepMediumSeverity() {
        AIAnalysisResult result = service.fallback("lampadaire cassé sans lumière", "Éclairage");
        assertEquals("MEDIUM", result.getSeverity());
    }

    @Test
    void moderateIncidentContent_rejectsRandomText() {
        ContentModerationResult result = service.moderateIncidentContent(
                "azerty qwerty",
                "asdf asdf asdf random test spam",
                "Voirie",
                "Gueliz");
        assertNotEquals(Boolean.TRUE, result.getAccepted());
    }

    @Test
    void fallbackModeration_repetitiveChars_shouldReject() {
        ContentModerationResult result = service.fallbackModeration(
                "route rue eau",
                "aaaaaaaa route rue fuite eau principale");
        assertNotEquals(Boolean.TRUE, result.getAccepted());
    }

    @Test
    void fallbackModeration_testKeywords_shouldReject() {
        ContentModerationResult result = service.fallbackModeration(
                "route fuite eau",
                "lorem ipsum route rue fuite eau principale");
        assertNotEquals(Boolean.TRUE, result.getAccepted());
    }

    @Test
    void fallbackModeration_lowLetterRatio_shouldReject() {
        ContentModerationResult result = service.fallbackModeration(
                "!!! ### $$$",
                "!!! ### $$$ route rue fuite");
        assertNotEquals(Boolean.TRUE, result.getAccepted());
    }
}
