package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class StatsResponse {

    private Long totalIncidents;
    private Long openIncidents;
    private Long inProgressIncidents;
    private Long resolvedIncidents;
    private Long highSeverityCount;
    private Long totalCitizens;
    private Long resolvedLast24h;
    private Double resolutionRate;
    private List<CategoryCount> incidentsByCategory;
    private List<SectorCount> incidentsBySector;
    private List<HourlyCount> incidentsByHour;
    private List<ServiceHealth> servicesHealth;

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CategoryCount {
        private String category;
        private Long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class SectorCount {
        private String sector;
        private Long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class HourlyCount {
        private Integer hour;
        private Long count;
    }

    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class ServiceHealth {
        private String serviceName;
        private Integer percentage;
        private String color;
    }
}
