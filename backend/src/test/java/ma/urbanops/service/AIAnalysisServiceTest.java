package ma.urbanops.service;

import ma.urbanops.dto.response.AIAnalysisResult;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.MockitoAnnotations;

import static org.junit.jupiter.api.Assertions.*;

class AIAnalysisServiceTest {

    @InjectMocks
    private AIAnalysisService aiAnalysisService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void fallback_shouldReturnHighSeverityForElectric() {
        // Act
        AIAnalysisResult result = aiAnalysisService.fallback("Câble électrique coupé sur la route", "Électricité");

        // Assert
        assertEquals("HIGH", result.getSeverity());
        assertEquals("ONEE Marrakech", result.getAuthorityName());
        assertTrue(result.getFallbackUsed());
    }

    @Test
    void fallback_shouldReturnMediumSeverityForTraffic() {
        // Act
        AIAnalysisResult result = aiAnalysisService.fallback("embouteillage monstre", "Transport");

        // Assert
        assertEquals("MEDIUM", result.getSeverity());
        assertEquals("Police Circulation", result.getAuthorityName());
    }

    @Test
    void fallback_shouldReturnLowSeverityForGarbage() {
        // Act
        AIAnalysisResult result = aiAnalysisService.fallback("poubelle pleine", "Déchets");

        // Assert
        assertEquals("LOW", result.getSeverity());
    }

    @Test
    @Disabled("Désactivé: nécessite une clé API Gemini valide — à tester en intégration")
    void analyzeIncident_withValidInput_shouldReturnAnalysis() {
        fail("Test désactivé intentionnellement - requires valid Gemini API key");
    }
}
