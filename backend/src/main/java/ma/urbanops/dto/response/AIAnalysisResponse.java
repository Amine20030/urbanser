package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.urbanops.enums.Severity;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AIAnalysisResponse {

    private String category;
    private Severity severity;
    private String reason;
    private String authorityToAlert;
    private String authorityEmail;
    private String summary;
    private String rawResponse;
}
