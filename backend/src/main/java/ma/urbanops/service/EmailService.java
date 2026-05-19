package ma.urbanops.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class EmailService {

    @Async
    public void sendAlertEmailFromJms(ma.urbanops.dto.jms.AlertMessage msg) {
        log.info("Sending alert to {}: {} at {}", msg.getAuthorityName(), msg.getCategory(), msg.getSector());
    }
}
