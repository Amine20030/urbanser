package ma.urbanops.service;

import ma.urbanops.dto.response.AIAnalysisResponse;
import ma.urbanops.enums.Severity;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class AIAnalysisServiceTest {

    @InjectMocks private AIAnalysisService aiAnalysisService;

    @BeforeAll
    static void initAll() {
        System.out.println("=== Starting AIAnalysisService Tests ===");
    }

    @BeforeEach
    void setUp() {
        // No mocking needed for basic mapping tests
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== AIAnalysisService Tests Complete ===");
    }

    @Test
    void mapSeverityFromAI_HIGH_shouldReturnHighEnum() {
        Severity result = aiAnalysisService.mapSeverityFromAI("HIGH");
        assertEquals(Severity.HIGH, result);
        assertNotNull(result);
    }

    @Test
    void mapSeverityFromAI_MED_shouldReturnMediumEnum() {
        Severity result = aiAnalysisService.mapSeverityFromAI("MED");
        assertEquals(Severity.MEDIUM, result);
    }

    @Test
    void mapSeverityFromAI_LOW_shouldReturnLowEnum() {
        Severity result = aiAnalysisService.mapSeverityFromAI("LOW");
        assertEquals(Severity.LOW, result);
    }

    @Test
    void mapSeverityFromAI_unknownString_shouldDefaultToMedium() {
        Severity result = aiAnalysisService.mapSeverityFromAI("UNKNOWN_VALUE");
        assertEquals(Severity.MEDIUM, result);
    }

    @Test
    void mapSeverityFromAI_null_shouldDefaultToMedium() {
        Severity result = aiAnalysisService.mapSeverityFromAI(null);
        assertNotNull(result);
        assertEquals(Severity.MEDIUM, result);
    }

    @Test
    void mapSeverityFromAI_emptyString_shouldDefaultToMedium() {
        Severity result = aiAnalysisService.mapSeverityFromAI("");
        assertEquals(Severity.MEDIUM, result);
    }

    @Test
    void buildAnalysisPrompt_shouldContainDescription() {
        String desc = "Fuite d'eau importante dans la rue";
        String prompt = aiAnalysisService.buildAnalysisPrompt(desc);
        assertNotNull(prompt);
        assertTrue(prompt.contains(desc));
        assertTrue(prompt.contains("JSON"));
    }

    @Test
    void buildAnalysisPrompt_withEmptyDescription_shouldStillBuildValidPrompt() {
        String prompt = aiAnalysisService.buildAnalysisPrompt("");
        assertNotNull(prompt);
        assertFalse(prompt.isEmpty());
    }

    @Test
    void buildAnalysisPrompt_shouldContainUrbanContext() {
        String prompt = aiAnalysisService.buildAnalysisPrompt("Test incident");
        assertTrue(prompt.contains("Marrakech"));
        assertTrue(prompt.contains("urban supervision"));
    }

    @Test
    void mapSeverityFromAI_caseInsensitive_shouldWork() {
        assertEquals(Severity.HIGH, aiAnalysisService.mapSeverityFromAI("high"));
        assertEquals(Severity.MEDIUM, aiAnalysisService.mapSeverityFromAI("medium"));
        assertEquals(Severity.LOW, aiAnalysisService.mapSeverityFromAI("low"));
    }

    @Test
    @Disabled("Désactivé: nécessite une clé API Gemini valide — à tester en intégration")
    void analyzeIncident_withValidInput_shouldReturnAnalysis() {
        fail("Test désactivé intentionnellement - requires valid Gemini API key");
    }
}
