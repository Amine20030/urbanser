package ma.urbanops.service;

import ma.urbanops.dto.response.ContentModerationResult;
import ma.urbanops.entity.Category;
import ma.urbanops.entity.IncidentContentModerationLog;
import ma.urbanops.entity.Sector;
import ma.urbanops.entity.User;
import ma.urbanops.repository.IncidentContentModerationLogRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IncidentContentModerationLogServiceTest {

    @Mock private IncidentContentModerationLogRepository repository;
    @InjectMocks private IncidentContentModerationLogService logService;

    @Test
    void log_shouldPersistModerationEntry() {
        User reporter = User.builder().email("citizen@test.ma").build();
        Category category = Category.builder().name("Eau").build();
        Sector sector = Sector.builder().name("Gueliz").build();
        ContentModerationResult result = ContentModerationResult.builder()
                .accepted(true)
                .reason("OK")
                .confidence(0.9)
                .fallbackUsed(false)
                .build();
        when(repository.save(any(IncidentContentModerationLog.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        logService.log(1L, "title", "description", category, sector, reporter, result);

        verify(repository).save(any(IncidentContentModerationLog.class));
    }

    @Test
    void log_withNullReporterAndResult_shouldStillPersist() {
        when(repository.save(any(IncidentContentModerationLog.class)))
                .thenAnswer(inv -> inv.getArgument(0));

        logService.log(null, "title", "description", null, null, null, null);

        verify(repository).save(any(IncidentContentModerationLog.class));
    }
}
