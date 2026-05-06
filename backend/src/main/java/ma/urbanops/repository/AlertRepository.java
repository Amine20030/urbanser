package ma.urbanops.repository;

import ma.urbanops.entity.Alert;
import ma.urbanops.entity.Incident;
import ma.urbanops.enums.Severity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByIncident(Incident incident);

    List<Alert> findBySeverity(Severity severity);

    List<Alert> findByAcknowledged(Boolean acknowledged);

    Page<Alert> findByAcknowledged(Boolean acknowledged, Pageable pageable);

    @Query("SELECT a FROM Alert a WHERE a.severity = :severity AND a.acknowledged = false ORDER BY a.sentAt DESC")
    List<Alert> findCriticalUnacknowledged(@Param("severity") Severity severity);

    @Query("SELECT a FROM Alert a WHERE a.acknowledged = false ORDER BY a.severity DESC, a.sentAt DESC")
    List<Alert> findAllUnacknowledgedOrderBySeverity();

    @Query("SELECT a FROM Alert a ORDER BY a.sentAt DESC")
    List<Alert> findRecentAlerts(Pageable pageable);

    @Query("SELECT COUNT(a) FROM Alert a WHERE a.severity = :severity AND a.acknowledged = false")
    Long countUnacknowledgedBySeverity(@Param("severity") Severity severity);

    @Query("SELECT a.sentTo, COUNT(a) FROM Alert a GROUP BY a.sentTo")
    List<Object[]> countByAuthority();
}
