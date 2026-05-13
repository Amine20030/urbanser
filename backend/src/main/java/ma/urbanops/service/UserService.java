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

@Service @Slf4j @RequiredArgsConstructor @Transactional
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(RegisterRequest req) {
        if (userRepository.existsByEmail(req.getEmail()))
            throw new IllegalArgumentException("Email already exists: " + req.getEmail());
        User u = User.builder()
            .firstName(req.getFirstName()).lastName(req.getLastName())
            .email(req.getEmail()).password(passwordEncoder.encode(req.getPassword()))
            .phone(req.getPhone()).sector(req.getSector())
            .role(Role.CITIZEN).isActive(true)
            .receiveAlerts(req.getReceiveAlerts() != null ? req.getReceiveAlerts() : true)
            .build();
        return userRepository.save(u);
    }

    @Transactional(readOnly=true)
    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User","email",email));
    }

    @Transactional(readOnly=true)
    public Page<User> findAll(Pageable pageable) { return userRepository.findAll(pageable); }

    @Transactional(readOnly=true)
    public User findById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User","id",id));
    }

    public User updateProfile(Long id, RegisterRequest req) {
        User u = findById(id);
        if(req.getFirstName()!=null) u.setFirstName(req.getFirstName());
        if(req.getLastName()!=null)  u.setLastName(req.getLastName());
        if(req.getPhone()!=null)     u.setPhone(req.getPhone());
        if(req.getSector()!=null)    u.setSector(req.getSector());
        return userRepository.save(u);
    }

    public void deactivateUser(Long id) {
        User u = findById(id); u.setIsActive(false); userRepository.save(u);
    }

    public long countCitizens() { return userRepository.countByRole(Role.CITIZEN); }
    public long countAll()      { return userRepository.count(); }
    public long countActiveThisWeek() {
        return userRepository.countByCreatedAtAfter(LocalDateTime.now().minusWeeks(1));
    }

    public UserResponse toResponse(User u) {
        return UserResponse.builder()
            .id(u.getId()).firstName(u.getFirstName()).lastName(u.getLastName())
            .email(u.getEmail()).phone(u.getPhone()).role(u.getRole())
            .sector(u.getSector())
            .receiveAlerts(u.getReceiveAlerts())
            .createdAt(u.getCreatedAt())
            .build();
    }
}
