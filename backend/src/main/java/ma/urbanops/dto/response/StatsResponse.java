package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class StatsResponse {
    long totalIncidents; long openIncidents; long inProgressIncidents;
    long resolvedIncidents; long highSeverityCount; long totalCitizens;
    long resolvedLast24h; double resolutionRate;
    
    List<CategoryCount> incidentsByCategory;
    List<SectorCount> incidentsBySector;
    List<HourlyCount> incidentsByHour;
    List<ServiceHealth> servicesHealth;

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class CategoryCount {
        private String category;
        private long count;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class SectorCount {
        private String sector;
        private long count;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class HourlyCount {
        private int hour;
        private long count;
    }

    @Data @NoArgsConstructor @AllArgsConstructor @Builder
    public static class ServiceHealth {
        private String serviceName;
        private int percentage;
        private String color;
    }
}
