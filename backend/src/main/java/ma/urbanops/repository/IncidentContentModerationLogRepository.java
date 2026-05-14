package ma.urbanops.repository;

import ma.urbanops.entity.IncidentContentModerationLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IncidentContentModerationLogRepository extends JpaRepository<IncidentContentModerationLog, Long> {
}
