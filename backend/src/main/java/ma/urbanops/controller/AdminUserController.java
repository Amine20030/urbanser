package ma.urbanops.controller;

import lombok.RequiredArgsConstructor;
import ma.urbanops.dto.request.CreateUserRequest;
import ma.urbanops.dto.request.UpdateUserRequest;
import ma.urbanops.dto.request.ChangePasswordRequest;
import ma.urbanops.dto.response.UserResponse;
import ma.urbanops.entity.User;
import ma.urbanops.enums.Role;
import ma.urbanops.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowedHeaders = "*")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        List<User> users = userService.findAllUsers();

        return ResponseEntity.ok(resp);
    }

    @GetMapping("/role/{role}")
    public ResponseEntity<List<UserResponse>> getByRole(@PathVariable String role) {
        Role r = Role.valueOf(role.toUpperCase());
        List<User> users = userService.findByRole(r);
        return ResponseEntity.ok(users.stream().map(userService::toResponse).toList());
    }

    @PostMapping
    public ResponseEntity<UserResponse> createUser(@RequestBody CreateUserRequest req) {
        if (userService.existsByEmail(req.getEmail())) {
            return ResponseEntity.badRequest().build();
        }
        User u = new User();
        u.setFirstName(req.getFirstName());
        u.setLastName(req.getLastName());
        u.setEmail(req.getEmail());
        u.setPassword(passwordEncoder.encode(req.getPassword()));
        u.setRole(req.getRole() != null ? req.getRole() : Role.CITIZEN);
        u.setPhone(req.getPhone());
        u.setSector(req.getSector());
        u.setReceiveAlerts(req.getReceiveAlerts() != null ? req.getReceiveAlerts() : true);
        u.setIsActive(true);
        User created = userService.save(u);
        return ResponseEntity.status(201).body(userService.toResponse(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> updateUser(@PathVariable Long id, @RequestBody UpdateUserRequest req) {
        User u = userService.findById(id);
        if (req.getFirstName() != null) u.setFirstName(req.getFirstName());
        if (req.getLastName() != null) u.setLastName(req.getLastName());
        if (req.getRole() != null) u.setRole(req.getRole());
        if (req.getPhone() != null) u.setPhone(req.getPhone());
        if (req.getSector() != null) u.setSector(req.getSector());
        User updated = userService.save(u);
        return ResponseEntity.ok(userService.toResponse(updated));
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<Void> changePassword(@PathVariable Long id, @RequestBody ChangePasswordRequest req) {
        User u = userService.findById(id);
        u.setPassword(passwordEncoder.encode(req.getNewPassword()));
        userService.save(u);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String currentEmail = auth != null ? auth.getName() : null;
        User current = currentEmail != null ? userService.findByEmail(currentEmail) : null;
        if (current != null && current.getId().equals(id)) {
            return ResponseEntity.badRequest().build();
        }
        userService.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-active")
    public ResponseEntity<UserResponse> toggleActive(@PathVariable Long id) {
        User u = userService.findById(id);
        u.setIsActive(!u.getIsActive());
        User updated = userService.save(u);

    }
}
