package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.entity.Alert;
import ma.urbanops.entity.Category;
import ma.urbanops.entity.Incident;
import ma.urbanops.enums.Severity;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.AlertRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AlertService {

    private final AlertRepository alertRepository;
    private final ma.urbanops.jms.AlertProducer alertProducer;

    @Transactional
    public Alert createAndSendAlert(Incident incident) {
        log.info("Creating alert for incident: {}", incident.getReferenceCode());
        
        Category category = incident.getCategory();
        String authorityEmail = category.getAuthorityEmail();
        String authorityName = category.getDefaultAuthority();
        
        Alert alert = Alert.builder()
                .incident(incident)
                .severity(incident.getSeverity())
                .title(incident.getTitle())
                .message(buildAlertMessage(incident))
                .sentTo(authorityEmail)
                .emailSent(false)
                .acknowledged(false)
                .build();
        
        Alert savedAlert = alertRepository.save(alert);
        
        // Queue authority alert email via JMS (consumer calls EmailService)
        if (authorityEmail != null && !authorityEmail.isEmpty()) {
            alertProducer.sendAlertToQueue(incident);
            savedAlert.setEmailSent(true);
            alertRepository.save(savedAlert);
            log.info("[JMS] Alert queued for incident {}", incident.getReferenceCode());
        }
        
        log.info("Alert created and sent for incident: {}", incident.getReferenceCode());
        return savedAlert;
    }

    private String buildAlertMessage(Incident incident) {
        return String.format("[%s] %s in %s - %s",
                incident.getSeverity(),
                incident.getTitle(),
                incident.getSector().getName(),
                incident.getDescription());
    }

    @Transactional
    public void resendAlert(Long alertId) {
        log.info("Resending alert: {}", alertId);
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", alertId));
        
        Incident incident = alert.getIncident();
        Category category = incident.getCategory();
        
        if (category.getAuthorityEmail() != null) {
            alertProducer.sendAlertToQueue(incident);
            alert.setEmailSent(true);
            alertRepository.save(alert);
        }
    }

    @Transactional
    public void acknowledgeAlert(Long alertId) {
        log.info("Acknowledging alert: {}", alertId);
        Alert alert = alertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", alertId));
        
        alert.acknowledge();
        alertRepository.save(alert);
    }

    public List<Alert> getCriticalUnacknowledgedAlerts() {
        return alertRepository.findCriticalUnacknowledged(Severity.HIGH);
    }

    public List<Alert> getAllUnacknowledgedAlerts() {
        return alertRepository.findAllUnacknowledgedOrderBySeverity();
    }

    public List<Alert> getRecentAlerts(int limit) {
        return alertRepository.findRecentAlerts(Pageable.ofSize(limit));
    }

    public Page<Alert> getAllAlerts(Pageable pageable) {
        return alertRepository.findAll(pageable);
    }

    public Alert findById(Long id) {
        return alertRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Alert", "id", id));
    }

    public List<Alert> findByIncident(Long incidentId) {
        return alertRepository.findByIncident(Incident.builder().id(incidentId).build());
    }
}
