package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.response.StatsResponse;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Role;
import ma.urbanops.enums.Severity;
import ma.urbanops.repository.AlertRepository;
import ma.urbanops.repository.IncidentRepository;
import ma.urbanops.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StatsService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final AlertRepository alertRepository;

    public StatsResponse getDashboardStats() {
        log.info("Generating dashboard stats");
        
        long totalIncidents = incidentRepository.count();
        long openIncidents = incidentRepository.countByStatus(IncidentStatus.OPEN);
        long inProgressIncidents = incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS);
        long resolvedIncidents = incidentRepository.countByStatus(IncidentStatus.RESOLVED);
        long highSeverityCount = incidentRepository.countBySeverity(Severity.HIGH);
        long totalCitizens = userRepository.countByRole(Role.CITIZEN);
        
        LocalDateTime last24h = LocalDateTime.now().minusHours(24);
        long resolvedLast24h = incidentRepository.countResolvedSince(last24h);
        
        double resolutionRate = calculateResolutionRate(totalIncidents, resolvedIncidents);
        
        List<StatsResponse.HourlyCount> hourlyStats;
        try {
            hourlyStats = getHourlyStats();
        } catch (Exception e) {
            log.warn("Hourly stats unavailable ({}), using empty series", e.getMessage());
            hourlyStats = new ArrayList<>();
        }

        return StatsResponse.builder()
                .totalIncidents(totalIncidents)
                .openIncidents(openIncidents)
                .inProgressIncidents(inProgressIncidents)
                .resolvedIncidents(resolvedIncidents)
                .highSeverityCount(highSeverityCount)
                .totalCitizens(totalCitizens)
                .resolvedLast24h(resolvedLast24h)
                .resolutionRate(resolutionRate)
                .incidentsByCategory(getStatsByCategory())
                .incidentsBySector(getStatsBySector())
                .incidentsByHour(hourlyStats)
                .servicesHealth(getServicesHealth())
                .build();
    }

    public double getResolutionRate() {
        long total = incidentRepository.count();
        long resolved = incidentRepository.countByStatus(IncidentStatus.RESOLVED);
        return calculateResolutionRate(total, resolved);
    }

    private double calculateResolutionRate(long total, long resolved) {
        if (total == 0) return 0.0;
        return Math.round((double) resolved / total * 100 * 100.0) / 100.0;
    }

    public List<StatsResponse.CategoryCount> getStatsByCategory() {
        List<Object[]> raw = incidentRepository.countByCategoryGrouped();
        List<StatsResponse.CategoryCount> result = new ArrayList<>();
        for (Object[] row : raw) {
            result.add(StatsResponse.CategoryCount.builder()
                    .category((String) row[0])
                    .count(((Number) row[1]).longValue())
                    .build());
        }
        return result;
    }

    public List<StatsResponse.SectorCount> getStatsBySector() {
        List<Object[]> raw = incidentRepository.countBySectorGrouped();
        List<StatsResponse.SectorCount> result = new ArrayList<>();
        for (Object[] row : raw) {
            result.add(StatsResponse.SectorCount.builder()
                    .sector((String) row[0])
                    .count(((Number) row[1]).longValue())
                    .build());
        }
        return result;
    }

    public List<StatsResponse.HourlyCount> getHourlyStats() {
        LocalDateTime last24h = LocalDateTime.now().minusHours(24);
        List<Object[]> raw = incidentRepository.countByHourLast24Hours(last24h);
        List<StatsResponse.HourlyCount> result = new ArrayList<>();
        for (Object[] row : raw) {
            result.add(StatsResponse.HourlyCount.builder()
                    .hour(((Number) row[0]).intValue())
                    .count(((Number) row[1]).longValue())
                    .build());
        }
        return result;
    }

    public List<StatsResponse.ServiceHealth> getServicesHealth() {
        List<Object[]> raw = incidentRepository.countByCategoryGrouped();
        long total = incidentRepository.count();
        List<StatsResponse.ServiceHealth> result = new ArrayList<>();
        
        for (Object[] row : raw) {
            String category = (String) row[0];
            long count = ((Number) row[1]).longValue();
            int percentage = total == 0 ? 0 : (int) Math.round((double) count / total * 100);
            String color = getHealthColor(percentage);
            result.add(StatsResponse.ServiceHealth.builder()
                    .serviceName(category)
                    .percentage(percentage)
                    .color(color)
                    .build());
        }
        return result;
    }

    private String getHealthColor(int percentage) {
        if (percentage > 50) return "#F87171"; // Red - high load
        if (percentage > 25) return "#FBBF24"; // Amber
        return "#34D399"; // Green
    }
}
