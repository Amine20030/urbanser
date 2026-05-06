package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Severity;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class IncidentMapDTO {

    private Long id;
    private String referenceCode;
    private String title;
    private Severity severity;
    private IncidentStatus status;
    private Double latitude;
    private Double longitude;
    private String category;
}
