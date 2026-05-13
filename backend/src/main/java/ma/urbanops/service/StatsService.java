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
import ma.urbanops.entity.Incident;

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
        
        long total    = incidentRepository.count();
        long open     = incidentRepository.countByStatus(IncidentStatus.OPEN);
        long inProg   = incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS);
        long resolved = incidentRepository.countByStatus(IncidentStatus.RESOLVED);
        long high     = incidentRepository.countBySeverity(Severity.HIGH);
        long citizens = userRepository.countByRole(Role.CITIZEN);
        long res24h   = incidentRepository.countResolvedSince(LocalDateTime.now().minusHours(24));
        double rate   = total > 0 ? (double) resolved / total * 100.0 : 0.0;

        return StatsResponse.builder()
            .totalIncidents(total).openIncidents(open)
            .inProgressIncidents(inProg).resolvedIncidents(resolved)
            .highSeverityCount(high).totalCitizens(citizens)
            .resolvedLast24h(res24h).resolutionRate(Math.round(rate * 10.0) / 10.0)
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

    public List<java.util.Map<String,Object>> getHourlyStats() {
        List<Incident> incidents = incidentRepository.findAll();
        List<java.util.Map<String,Object>> hourly = new ArrayList<>();
        for (int h = 0; h < 24; h++) {
            final int hour = h;
            long count = incidents.stream()
                .filter(i -> i.getCreatedAt() != null && i.getCreatedAt().getHour() == hour)
                .count();
            hourly.add(java.util.Map.of("hour", String.format("%02dh", h), "count", count));
        }
        return hourly;
    }

    public List<StatsResponse.ServiceHealth> getServicesHealth() {
        List<Incident> incidents = incidentRepository.findAll();
        java.util.Map<String, List<Incident>> byCategory = incidents.stream()
                .filter(i -> i.getCategory() != null)
                .collect(java.util.stream.Collectors.groupingBy(i -> i.getCategory().getName()));
        
        List<StatsResponse.ServiceHealth> result = new ArrayList<>();
        for (java.util.Map.Entry<String, List<Incident>> entry : byCategory.entrySet()) {
            String category = entry.getKey();
            List<Incident> list = entry.getValue();
            long total = list.size();
            long resolved = list.stream().filter(i -> i.getStatus() == IncidentStatus.RESOLVED).count();
            int healthPercent = total == 0 ? 100 : (int) Math.round((double) resolved / total * 100.0);
            if (healthPercent < 50) healthPercent = 50;
            if (healthPercent > 100) healthPercent = 100;
            
            result.add(StatsResponse.ServiceHealth.builder()
                    .serviceName(category)
                    .percentage(healthPercent)
                    .color(getHealthColor(healthPercent))
                    .build());
        }
        return result;
    }

    private String getHealthColor(int percentage) {
        if (percentage > 50) return "#34D399"; // Green
        if (percentage > 25) return "#FBBF24"; // Amber
        return "#F87171"; // Red - low health
    }
}
