package ma.urbanops.repository;

import ma.urbanops.entity.Sector;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SectorRepository extends JpaRepository<Sector, Long> {

    Optional<Sector> findByName(String name);

    boolean existsByName(String name);

    List<Sector> findByIsActiveTrue();

    List<Sector> findByCity(String city);

    @Query("SELECT s FROM Sector s WHERE s.isActive = true ORDER BY s.name ASC")
    List<Sector> findAllActiveOrderByName();
}
