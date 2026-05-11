package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.entity.Incident;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Severity;
import ma.urbanops.repository.AlertRepository;
import ma.urbanops.repository.IncidentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Scheduled background tasks for UrbanOps.
 *
 * These tasks run autonomously in separate threads and constitute
 * an example of distributed asynchronous processing in the system.
 *
 * Features:
 * - Daily summary logging (08:00 daily)
 * - Overdue incident detection (every 30 minutes)
 *
 * @author UrbanOps Team
 * @version 1.0.0
 * @see org.springframework.scheduling.annotation.Scheduled
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ScheduledTaskService {

    private final IncidentRepository incidentRepository;
    private final AlertRepository alertRepository;

    @Value("${app.schedule.daily-summary-cron:0 0 8 * * *}")
    private String dailySummaryCron;

    @Value("${app.schedule.overdue-check-rate:1800000}")
    private long overdueCheckRate;

    /**
     * Daily summary log — runs every day at 08:00.
     * Logs the current state of the system for monitoring purposes.
     *
     * Cron expression: second minute hour day month day-of-week
     * 0 0 8 * * * = 08:00:00 every day
     */
    @Scheduled(cron = "${app.schedule.daily-summary-cron:0 0 8 * * *}")
    @Transactional(readOnly = true)
    public void dailySummaryLog() {
        long open = incidentRepository.countByStatus(IncidentStatus.OPEN);
        long inProgress = incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS);
        long criticalUnack = alertRepository.findCriticalUnacknowledged().size();

        log.info("╔════════════════════════════════════════════════════════════╗");
        log.info("║              URBANOPS DAILY SUMMARY REPORT                 ║");
        log.info("╠════════════════════════════════════════════════════════════╣");
        log.info("║  Open Incidents:        {}                                    ║", String.format("%3d", open));
        log.info("║  In Progress:           {}                                    ║", String.format("%3d", inProgress));
        log.info("║  Critical Alerts:       {}                                    ║", String.format("%3d", criticalUnack));
        log.info("╚════════════════════════════════════════════════════════════╝");
    }

    /**
     * Overdue incident checker — runs every 30 minutes.
     * Detects HIGH severity incidents that have been open for more than 2 hours.
     * Logs warnings for manual intervention.
     *
     * Fixed rate: 1800000ms = 30 minutes
     */
    @Scheduled(fixedRateString = "${app.schedule.overdue-check-rate:1800000}")
    @Transactional(readOnly = true)
    public void checkOverdueHighSeverityIncidents() {
        LocalDateTime twoHoursAgo = LocalDateTime.now().minusHours(2);

        List<Incident> overdueIncidents = incidentRepository.findBySeverityAndStatusAndCreatedAtBefore(
                Severity.HIGH, IncidentStatus.OPEN, twoHoursAgo);

        if (!overdueIncidents.isEmpty()) {
            log.warn("⚠️  ALERT: {} HIGH severity incident(s) still OPEN after 2 hours!", overdueIncidents.size());

            for (Incident incident : overdueIncidents) {
                log.warn("   → {}: {} (created at {})",
                        incident.getReferenceCode(),
                        incident.getTitle(),
                        incident.getCreatedAt());
            }
        } else {
            log.debug("✓ No overdue HIGH severity incidents found");
        }
    }

    /**
     * Hourly stats aggregation — runs every hour at minute 0.
     * Could be extended to cache stats or send hourly reports.
     */
    @Scheduled(cron = "0 0 * * * *")
    @Transactional(readOnly = true)
    public void hourlyStatsAggregation() {
        LocalDateTime oneHourAgo = LocalDateTime.now().minusHours(1);
        long newIncidents = incidentRepository.countCreatedAfter(oneHourAgo);

        if (newIncidents > 0) {
            log.info("📊 Hourly stats: {} new incident(s) in the last hour", newIncidents);
        }
    }
}
