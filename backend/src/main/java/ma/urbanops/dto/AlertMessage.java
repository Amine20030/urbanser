package ma.urbanops.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertMessage implements Serializable {
    private String authorityName;
    private String email;
    private String incidentReference;
    private String severity;
    private String sectorName;
    private String categoryName;
    private String date;
    private String description;
    private Double latitude;
    private Double longitude;
}
