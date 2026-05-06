package ma.urbanops.controller;

import ma.urbanops.dto.request.LoginRequest;
import ma.urbanops.dto.request.RegisterRequest;
import ma.urbanops.dto.response.AuthResponse;
import ma.urbanops.dto.response.UserResponse;
import ma.urbanops.entity.User;
import ma.urbanops.enums.Role;
import ma.urbanops.security.JwtTokenProvider;
import ma.urbanops.security.UserDetailsImpl;
import ma.urbanops.service.UserService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock private AuthenticationManager authenticationManager;
    @Mock private JwtTokenProvider tokenProvider;
    @Mock private UserService userService;

    @InjectMocks private AuthController authController;

    private User testUser;
    private UserDetailsImpl userDetails;

    @BeforeAll
    static void initAll() {
        System.out.println("=== Starting AuthController Tests ===");
    }

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .firstName("Yassine")
                .lastName("Benali")
                .email("yassine@test.ma")
                .role(Role.CITIZEN)
                .build();

        userDetails = UserDetailsImpl.build(testUser);
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== AuthController Tests Complete ===");
    }

    @Test
    void register_withValidData_shouldReturnUserResponse() {
        RegisterRequest request = RegisterRequest.builder()
                .firstName("Yassine")
                .lastName("Benali")
                .email("yassine@test.ma")
                .password("password123")
                .build();

        when(userService.register(any(RegisterRequest.class))).thenReturn(testUser);
        when(userService.toResponse(any(User.class))).thenReturn(UserResponse.builder()
                .id(1L)
                .firstName("Yassine")
                .email("yassine@test.ma")
                .build());

        ResponseEntity<UserResponse> result = authController.register(request);

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
        assertEquals("yassine@test.ma", result.getBody().getEmail());
    }

    @Test
    void login_withValidCredentials_shouldReturnToken() {
        LoginRequest request = LoginRequest.builder()
                .email("yassine@test.ma")
                .password("password123")
                .build();

        Authentication authentication = mock(Authentication.class);
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);
        when(authentication.getPrincipal()).thenReturn(userDetails);
        when(tokenProvider.generateToken(any(Authentication.class))).thenReturn("test-jwt-token");
        when(tokenProvider.getExpirationTime()).thenReturn(86400000L);
        when(userService.findByEmail(any())).thenReturn(testUser);
        when(userService.toResponse(any(User.class))).thenReturn(UserResponse.builder()
                .id(1L)
                .email("yassine@test.ma")
                .build());

        ResponseEntity<AuthResponse> result = authController.login(request);

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
        assertNotNull(result.getBody());
        assertEquals("test-jwt-token", result.getBody().getToken());
    }

    @Test
    void getCurrentUser_shouldReturnUserResponse() {
        when(userService.findByEmail(userDetails.getUsername())).thenReturn(testUser);
        when(userService.toResponse(any(User.class))).thenReturn(UserResponse.builder()
                .id(1L)
                .email("yassine@test.ma")
                .build());

        ResponseEntity<UserResponse> result = authController.getCurrentUser(userDetails);

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
    }

    @Test
    void logout_shouldReturnOk() {
        ResponseEntity<Void> result = authController.logout();

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
    }
}
