package ma.urbanops.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import ma.urbanops.dto.response.ContentModerationResult;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

class AIAnalysisServiceTest {

    private final AIAnalysisService service = new AIAnalysisService(null, new ObjectMapper());

    @Test
    void fallbackModeration_whenTextHasNoUrbanProblem_shouldReject() {
        ContentModerationResult result = service.fallbackModeration(
                "is not is you",
                "be as incident");

        assertFalse(Boolean.TRUE.equals(result.getAccepted()));
    }

    @Test
    void fallbackModeration_whenTextDescribesUrbanProblem_shouldAccept() {
        ContentModerationResult result = service.fallbackModeration(
                "Fuite d'eau devant la maison",
                "Il y a une fuite d'eau importante dans la rue principale");

        assertTrue(Boolean.TRUE.equals(result.getAccepted()));
    }
}
