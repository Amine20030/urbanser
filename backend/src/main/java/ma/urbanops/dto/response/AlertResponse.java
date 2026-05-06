package ma.urbanops.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import ma.urbanops.enums.Severity;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AlertResponse {

    private Long id;
    private Long incidentId;
    private String incidentReference;
    private Severity severity;
    private String title;
    private String message;
    private String sentTo;
    private Boolean emailSent;
    private LocalDateTime sentAt;
    private Boolean acknowledged;
    private LocalDateTime acknowledgedAt;
}
