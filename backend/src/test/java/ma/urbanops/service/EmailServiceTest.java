package ma.urbanops.service;

import ma.urbanops.dto.jms.AlertMessage;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;

class EmailServiceTest {

    private final EmailService emailService = new EmailService();

    @Test
    void sendAlertEmailFromJms_shouldNotThrow() {
        assertDoesNotThrow(() -> {
            AlertMessage msg = AlertMessage.builder()
                .authorityName("ONEE")
                .authorityEmail("onee@test.ma")
                .referenceCode("INC-1")
                .severity("HIGH")
                .sector("Avenue X")
                .category("Eau")
                .description("Fuite")
                .latitude(31.63)
                .longitude(-8.0)
                .build();
            emailService.sendAlertEmailFromJms(msg);
        });
    }

    @Test
    void sendAlertEmailFromJms_withNullCoordinates_shouldNotThrow() {
        assertDoesNotThrow(() -> {
            AlertMessage msg = AlertMessage.builder()
                .authorityName("Police")
                .authorityEmail("police@test.ma")
                .referenceCode("INC-2")
                .severity("MEDIUM")
                .sector("Rue Y")
                .category("Transport")
                .description("Details")
                .latitude(null)
                .longitude(null)
                .build();
            emailService.sendAlertEmailFromJms(msg);
        });
    }

    @Test
    void sendAlertEmailFromJms_withEmptyStrings_shouldNotThrow() {
        assertDoesNotThrow(() -> {
            AlertMessage msg = AlertMessage.builder()
                .authorityName("")
                .authorityEmail("")
                .referenceCode("")
                .severity("")
                .sector("")
                .category("")
                .description("")
                .latitude(0.0)
                .longitude(0.0)
                .build();
            emailService.sendAlertEmailFromJms(msg);
        });
    }
}
