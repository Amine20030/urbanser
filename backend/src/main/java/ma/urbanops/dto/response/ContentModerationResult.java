package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ContentModerationResult {
    private Boolean accepted;
    private String reason;
    private Double confidence;
    private Boolean fallbackUsed;
    private String rawResponse;
}
