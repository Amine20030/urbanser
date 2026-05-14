package ma.urbanops.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "incident_content_moderation_logs", indexes = {
    @Index(name = "idx_moderation_accepted", columnList = "accepted"),
    @Index(name = "idx_moderation_created_at", columnList = "created_at"),
    @Index(name = "idx_moderation_reporter_email", columnList = "reporter_email")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class IncidentContentModerationLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "incident_id")
    private Long incidentId;

    @Column(name = "reporter_email", length = 255)
    private String reporterEmail;

    @Column(length = 255)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "category_name", length = 100)
    private String categoryName;

    @Column(name = "sector_name", length = 100)
    private String sectorName;

    @Column(nullable = false)
    private Boolean accepted;

    @Column(length = 1000)
    private String reason;

    private Double confidence;

    @Column(name = "fallback_used")
    private Boolean fallbackUsed;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
