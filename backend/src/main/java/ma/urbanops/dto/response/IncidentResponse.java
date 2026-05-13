package ma.urbanops.dto.response;

import lombok.*;
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
    private String severity;
    private String status;
    private UserResponse reportedBy;
    private String photoUrl;
    private Double latitude;
    private Double longitude;
    private String authorityNotified;
    private String aiAnalysisResult;
    private Boolean alertSent;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime resolvedAt;
}
