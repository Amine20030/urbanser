package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
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

@Service
@RequiredArgsConstructor
@Transactional
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .sector(request.getSector())
                .receiveAlerts(request.getReceiveAlerts() != null ? request.getReceiveAlerts() : true)
                .role(Role.CITIZEN)
                .build();
        return userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User", "email", email));
    }

    @Transactional(readOnly = true)
    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));
    }

    @Transactional(readOnly = true)
    public Page<User> findAll(Pageable pageable) {
        return userRepository.findAll(pageable);
    }

    public User updateProfile(Long userId, RegisterRequest request) {
        User user = findById(userId);
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setSector(request.getSector());
        if (request.getReceiveAlerts() != null) {
            user.setReceiveAlerts(request.getReceiveAlerts());
        }
        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }
        return userRepository.save(user);
    }

    public void deactivateUser(Long id) {
        User user = findById(id);
        user.setIsActive(false);
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public long countCitizens() {
        return userRepository.countByRole(Role.CITIZEN);
    }

    @Transactional(readOnly = true)
    public long countActiveThisWeek() {
        Long n = userRepository.countByCreatedAtAfter(LocalDateTime.now().minusDays(7));
        return n != null ? n : 0L;
    }

    @Transactional(readOnly = true)
    public long countAll() {
        return userRepository.count();
    }

    public UserResponse toResponse(User u) {
        return UserResponse.builder()
                .id(u.getId())
                .firstName(u.getFirstName())
                .lastName(u.getLastName())
                .email(u.getEmail())
                .phone(u.getPhone())
                .role(u.getRole())
                .sector(u.getSector())
                .receiveAlerts(u.getReceiveAlerts())
                .createdAt(u.getCreatedAt())
                .build();
    }

    // Admin helpers
    @Transactional(readOnly = true)
    public java.util.List<User> findAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public java.util.List<User> findByRole(Role role) {
        return userRepository.findByRole(role);
    }

    public boolean existsByEmail(String email) {
        return userRepository.existsByEmail(email);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public void deleteById(Long id) {
        userRepository.deleteById(id);
    }
}
