package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @NoArgsConstructor @AllArgsConstructor @Builder
public class SectorResponse {
    Long id; String name; String city;
    Double centerLat; Double centerLng; String description;
}
