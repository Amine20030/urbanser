package ma.urbanops.service;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class EmailServiceTest {

    private final EmailService emailService = new EmailService();

    @Test
    void sendAlertEmailFromJms_shouldNotThrow() {
        assertDoesNotThrow(() -> emailService.sendAlertEmailFromJms(
                "ONEE", "onee@test.ma", "INC-1", "HIGH", "Avenue X", "Eau", "2026-05-18", "Fuite", 31.63, -8.0));
    }

    @Test
    void sendAlertEmailFromJms_withNullCoordinates_shouldNotThrow() {
        assertDoesNotThrow(() -> emailService.sendAlertEmailFromJms(
                "Police", "police@test.ma", "INC-2", "MEDIUM", "Rue Y", "Transport", "2026-05-18", "Details", null, null));
    }

    @Test
    void sendAlertEmailFromJms_withEmptyStrings_shouldNotThrow() {
        assertDoesNotThrow(() -> emailService.sendAlertEmailFromJms(
                "", "", "", "", "", "", "", "", 0.0, 0.0));
    }
}
