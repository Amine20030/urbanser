package ma.urbanops.dto.jms;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertMessage {
    private Long incidentId;
    private String referenceCode;
    private String title;
    private String description;
    private String severity;
    private String category;
    private String sector;
    private String authorityName;
    private String authorityEmail;
    private Double latitude;
    private Double longitude;
    private String reporterEmail;
    private String createdAt;
}
