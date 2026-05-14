package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.response.ContentModerationResult;
import ma.urbanops.entity.Category;
import ma.urbanops.entity.IncidentContentModerationLog;
import ma.urbanops.entity.Sector;
import ma.urbanops.entity.User;
import ma.urbanops.repository.IncidentContentModerationLogRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class IncidentContentModerationLogService {

    private final IncidentContentModerationLogRepository repository;

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void log(Long incidentId, String title, String description, Category category, Sector sector,
                    User reporter, ContentModerationResult result) {
        repository.save(IncidentContentModerationLog.builder()
                .incidentId(incidentId)
                .reporterEmail(reporter != null ? reporter.getEmail() : null)
                .title(title)
                .description(description)
                .categoryName(category != null ? category.getName() : null)
                .sectorName(sector != null ? sector.getName() : null)
                .accepted(result != null && Boolean.TRUE.equals(result.getAccepted()))
                .reason(result != null ? result.getReason() : "Moderation result missing")
                .confidence(result != null ? result.getConfidence() : null)
                .fallbackUsed(result != null ? result.getFallbackUsed() : null)
                .build());
    }
}
