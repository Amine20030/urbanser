package ma.urbanops.repository;

import ma.urbanops.entity.Incident;
import ma.urbanops.entity.User;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Severity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, Long>, JpaSpecificationExecutor<Incident> {

    Optional<Incident> findByReferenceCode(String referenceCode);

    List<Incident> findByStatus(IncidentStatus status);

    List<Incident> findBySeverity(Severity severity);

    List<Incident> findByReportedBy(User user);

    Page<Incident> findByReportedBy(User user, Pageable pageable);

    @Query("SELECT i FROM Incident i WHERE i.status = :status ORDER BY i.createdAt DESC")
    List<Incident> findRecentByStatus(@Param("status") IncidentStatus status, Pageable pageable);

    @Query("SELECT i FROM Incident i ORDER BY i.createdAt DESC")
    List<Incident> findTopNByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.status = :status")
    Long countByStatus(@Param("status") IncidentStatus status);

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.severity = :severity")
    Long countBySeverity(@Param("severity") Severity severity);

    @Query("SELECT i.severity, COUNT(i) FROM Incident i GROUP BY i.severity")
    List<Object[]> countBySeverityGrouped();

    @Query("SELECT i.status, COUNT(i) FROM Incident i GROUP BY i.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT i.category.name, COUNT(i) FROM Incident i GROUP BY i.category.name")
    List<Object[]> countByCategoryGrouped();

    @Query("SELECT i.sector.name, COUNT(i) FROM Incident i GROUP BY i.sector.name")
    List<Object[]> countBySectorGrouped();

    @Query("SELECT FUNCTION('DATE', i.createdAt), COUNT(i) FROM Incident i WHERE i.createdAt >= :startDate GROUP BY FUNCTION('DATE', i.createdAt)")
    List<Object[]> countByDayLast30Days(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT FUNCTION('HOUR', i.createdAt), COUNT(i) FROM Incident i WHERE i.createdAt >= :startDate GROUP BY FUNCTION('HOUR', i.createdAt)")
    List<Object[]> countByHourLast24Hours(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.status = 'RESOLVED' AND i.resolvedAt >= :startDate")
    Long countResolvedSince(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.createdAt >= :date")
    Long countCreatedAfter(@Param("date") LocalDateTime date);

    List<Incident> findByLatitudeBetweenAndLongitudeBetween(Double latMin, Double latMax, Double lngMin, Double lngMax);

    @Query("SELECT i FROM Incident i WHERE i.status != 'RESOLVED' ORDER BY i.severity DESC, i.createdAt DESC")
    List<Incident> findActiveIncidentsOrderBySeverityAndDate();
}
