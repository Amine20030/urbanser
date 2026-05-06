package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SectorResponse {

    private Long id;
    private String name;
    private String city;
    private Double centerLat;
    private Double centerLng;
    private String description;
}
