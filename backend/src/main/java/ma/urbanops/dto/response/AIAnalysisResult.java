package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data @Builder @NoArgsConstructor @AllArgsConstructor
public class AIAnalysisResult {
    private String category;
    private String severity;        // "HIGH", "MEDIUM", "LOW"
    private String authorityName;
    private String authorityEmail;
    private String reason;
    private String summary;
    private Double confidence;
    private Boolean fallbackUsed;
    private String rawResponse;
}
