package ma.urbanops.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    @Async
    public void sendAlertEmailFromJms(String authorityName, String authorityEmail, String eventId, String level, String address, String type, String date, String details, Double latitude, Double longitude) {
        log.info("Sending alert to {}: {} at {}", authorityName, type, address);
    }
}
