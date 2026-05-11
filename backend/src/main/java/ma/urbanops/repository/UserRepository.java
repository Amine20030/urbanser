package ma.urbanops.repository;

import ma.urbanops.entity.User;
import ma.urbanops.enums.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    List<User> findByRole(Role role);

    Page<User> findByRole(Role role, Pageable pageable);

    List<User> findByIsActiveTrue();

    @Query("SELECT u FROM User u WHERE u.receiveAlerts = true AND u.sector = ?1")
    List<User> findByReceiveAlertsTrueAndSector(String sector);

    @Query("SELECT COUNT(u) FROM User u WHERE u.role = ?1")
    long countByRole(Role role);

    @Query("SELECT COUNT(u) FROM User u WHERE u.createdAt >= ?1")
    Long countByCreatedAtAfter(LocalDateTime date);

    @Query("SELECT u FROM User u WHERE u.isActive = true ORDER BY u.createdAt DESC")
    List<User> findRecentActiveUsers(Pageable pageable);
}
