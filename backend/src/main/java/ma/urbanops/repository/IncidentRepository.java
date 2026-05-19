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
    long countByStatus(@Param("status") IncidentStatus status);

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.severity = :severity")
    long countBySeverity(@Param("severity") Severity severity);

    @Query("SELECT i.severity, COUNT(i) FROM Incident i GROUP BY i.severity")
    List<Object[]> countBySeverityGrouped();

    @Query("SELECT i.status, COUNT(i) FROM Incident i GROUP BY i.status")
    List<Object[]> countByStatusGrouped();

    @Query("SELECT i.category.name, COUNT(i) FROM Incident i GROUP BY i.category.name")
    List<Object[]> countByCategoryGrouped();

    @Query("SELECT i.sector.name, COUNT(i) FROM Incident i GROUP BY i.sector.name")
    List<Object[]> countBySectorGrouped();

    @Query(value = """
            SELECT CAST(i.created_at AS date), COUNT(*)
            FROM incidents i
            WHERE i.created_at >= :startDate
            GROUP BY CAST(i.created_at AS date)
            ORDER BY 1
            """, nativeQuery = true)
    List<Object[]> countByDayLast30Days(@Param("startDate") LocalDateTime startDate);

    /** PostgreSQL — date_part is reliable across PG versions for hourly buckets. */
    @Query(value = """
            SELECT CAST(date_part('hour', i.created_at) AS INTEGER), COUNT(*)
            FROM incidents i
            WHERE i.created_at >= :startDate
            GROUP BY date_part('hour', i.created_at)
            ORDER BY 1
            """, nativeQuery = true)
    List<Object[]> countByHourLast24Hours(@Param("startDate") LocalDateTime startDate);

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.createdAt >= :date")
    long countCreatedAfter(@Param("date") LocalDateTime date);

    // FIX 1: Method required by StatsService line 40 — count resolved incidents since a date
    @Query("SELECT COUNT(i) FROM Incident i " +
           "WHERE i.status = ma.urbanops.enums.IncidentStatus.RESOLVED " +
           "AND i.resolvedAt >= :since")
    long countResolvedSince(@Param("since") LocalDateTime since);

    List<Incident> findByLatitudeBetweenAndLongitudeBetween(Double latMin, Double latMax, Double lngMin, Double lngMax);

    @Query("SELECT i FROM Incident i WHERE i.status != 'RESOLVED' ORDER BY i.severity DESC, i.createdAt DESC")
    List<Incident> findActiveIncidentsOrderBySeverityAndDate();

    // @Query for dynamic filtering with pagination — used by dashboard filters
    @Query("SELECT i FROM Incident i " +
           "WHERE (:severity IS NULL OR i.severity = :severity) " +
           "AND (:status IS NULL OR i.status = :status) " +
           "AND (:categoryId IS NULL OR i.category.id = :categoryId) " +
           "AND (:sectorId IS NULL OR i.sector.id = :sectorId) " +
           "AND (:keyword IS NULL OR LOWER(i.title) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "     OR LOWER(i.description) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Incident> findWithFilters(
            @Param("severity") Severity severity,
            @Param("status") IncidentStatus status,
            @Param("categoryId") Long categoryId,
            @Param("sectorId") Long sectorId,
            @Param("keyword") String keyword,
            Pageable pageable);

    // @Query for category stats — returns category name and count
    @Query("SELECT c.name, COUNT(i) FROM Incident i " +
           "JOIN i.category c GROUP BY c.name ORDER BY COUNT(i) DESC")
    List<Object[]> countGroupedByCategory();

    // @Query to find HIGH severity incidents open for more than X hours — used by scheduled tasks
    @Query("SELECT i FROM Incident i WHERE i.severity = :severity AND i.status = :status AND i.createdAt < :before")
    List<Incident> findBySeverityAndStatusAndCreatedAtBefore(
            @Param("severity") Severity severity,
            @Param("status") IncidentStatus status,
            @Param("before") LocalDateTime before);

    @Query("SELECT i FROM Incident i JOIN FETCH i.category JOIN FETCH i.sector WHERE i.latitude IS NOT NULL AND i.longitude IS NOT NULL")
    List<Incident> findAllForMap();
}
