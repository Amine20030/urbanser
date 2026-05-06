package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.request.RegisterRequest;
import ma.urbanops.dto.response.UserResponse;
import ma.urbanops.entity.User;
import ma.urbanops.enums.Role;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public User register(RegisterRequest request) {
        log.info("Registering new user with email: {}", request.getEmail());
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered: " + request.getEmail());
        }

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .sector(request.getSector())
                .role(Role.CITIZEN)
                .receiveAlerts(request.getReceiveAlerts() != null ? request.getReceiveAlerts() : true)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);
        log.info("User registered successfully with id: {}", savedUser.getId());
        return savedUser;
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public List<User> findAllCitizens() {
        return userRepository.findByRole(Role.CITIZEN);
    }

    public long countAll() {
        return userRepository.count();
    }

    public long countCitizens() {
        return userRepository.countByRole(Role.CITIZEN);
    }

    public long countActiveThisWeek() {
        LocalDateTime oneWeekAgo = LocalDateTime.now().minusWeeks(1);
        return userRepository.countByCreatedAtAfter(oneWeekAgo);
    }

    @Transactional
    public void deactivateUser(Long id) {
        log.info("Deactivating user with id: {}", id);
        User user = findById(id);
        user.setIsActive(false);
        userRepository.save(user);
        log.info("User {} deactivated successfully", id);
    }

    @Transactional
    public User updateProfile(Long id, RegisterRequest request) {
        log.info("Updating profile for user id: {}", id);
        User user = findById(id);
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setSector(request.getSector());
        if (request.getReceiveAlerts() != null) {
            user.setReceiveAlerts(request.getReceiveAlerts());
        }

        return userRepository.save(user);
    }

    @Transactional
    public void changePassword(Long id, String currentPassword, String newPassword) {
        log.info("Changing password for user id: {}", id);
        User user = findById(id);
        
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        log.info("Password changed successfully for user id: {}", id);
    }

    public UserResponse toResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .phone(user.getPhone())
                .role(user.getRole())
                .sector(user.getSector())
                .receiveAlerts(user.getReceiveAlerts())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
