package ma.urbanops.jms;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.jms.AlertMessage;
import ma.urbanops.entity.Incident;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jms.core.JmsTemplate;
import org.springframework.stereotype.Component;

@Component
@Slf4j
@RequiredArgsConstructor
public class AlertProducer {

    private final JmsTemplate jmsTemplate;

    @Value("${jms.queue.alert}")
    private String alertQueue;

    /**
     * Sends an alert message to the JMS queue.
     * Returns immediately — the consumer processes it asynchronously.
     */
    public void sendAlertToQueue(Incident incident) {
        try {
            AlertMessage message = AlertMessage.builder()
                    .incidentId(incident.getId())
                    .referenceCode(incident.getReferenceCode())
                    .title(incident.getTitle())
                    .description(incident.getDescription())
                    .severity(incident.getSeverity() != null ? incident.getSeverity().name() : "MEDIUM")
                    .category(incident.getCategory() != null ? incident.getCategory().getName() : "")
                    .sector(incident.getSector() != null ? incident.getSector().getName() : "")
                    .authorityName(incident.getAuthorityNotified())
                    .authorityEmail(incident.getCategory() != null
                            ? incident.getCategory().getAuthorityEmail() : "")
                    .latitude(incident.getLatitude())
                    .longitude(incident.getLongitude())
                    .reporterEmail(incident.getReportedBy() != null
                            ? incident.getReportedBy().getEmail() : "anonyme")
                    .createdAt(incident.getCreatedAt() != null
                            ? incident.getCreatedAt().toString() : "")
                    .build();

            jmsTemplate.convertAndSend(alertQueue, message);
            log.info("[JMS PRODUCER] Alert message sent to queue '{}' for incident {}",
                    alertQueue, incident.getReferenceCode());

        } catch (Exception e) {
            log.error("[JMS PRODUCER] Failed to send to queue, incident saved anyway: {}",
                    e.getMessage());
        }
    }
}
