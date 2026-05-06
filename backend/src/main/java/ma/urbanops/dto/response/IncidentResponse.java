package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Severity;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentResponse {

    private Long id;
    private String referenceCode;
    private String title;
    private String description;
    private CategoryResponse category;
    private SectorResponse sector;
    private Severity severity;
    private IncidentStatus status;
    private UserResponse reportedBy;
    private String photoUrl;
    private Double latitude;
    private Double longitude;
    private String aiAnalysisResult;
    private String authorityNotified;
    private Boolean alertSent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
