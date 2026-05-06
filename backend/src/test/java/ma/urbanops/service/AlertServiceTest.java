package ma.urbanops.service;

import ma.urbanops.entity.Alert;
import ma.urbanops.entity.Category;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.Sector;
import ma.urbanops.enums.Severity;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.AlertRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AlertServiceTest {

    @Mock private AlertRepository alertRepository;
    @Mock private EmailService emailService;

    @InjectMocks private AlertService alertService;

    private Incident testIncident;
    private Alert testAlert;

    @BeforeAll
    static void initAll() {
        System.out.println("=== Starting AlertService Tests ===");
    }

    @BeforeEach
    void setUp() {
        Category category = Category.builder()
                .id(1L)
                .name("Eau")
                .defaultAuthority("RADEEMA")
                .authorityEmail("alerts@radeema.ma")
                .build();

        Sector sector = Sector.builder().id(1L).name("Médina").build();

        testIncident = Incident.builder()
                .id(1L)
                .referenceCode("INC-1001")
                .title("Fuite d'eau")
                .category(category)
                .sector(sector)
                .severity(Severity.HIGH)
                .build();

        testAlert = Alert.builder()
                .id(1L)
                .incident(testIncident)
                .severity(Severity.HIGH)
                .title("Fuite d'eau")
                .sentTo("alerts@radeema.ma")
                .emailSent(false)
                .acknowledged(false)
                .build();
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== AlertService Tests Complete ===");
    }

    @Test
    void createAndSendAlert_shouldSaveAlertEntity() {
        when(alertRepository.save(any(Alert.class))).thenReturn(testAlert);

        Alert result = alertService.createAndSendAlert(testIncident);

        assertNotNull(result);
        assertEquals(Severity.HIGH, result.getSeverity());
        verify(alertRepository, times(2)).save(any(Alert.class));
    }

    @Test
    void createAndSendAlert_whenHighSeverity_shouldSendEmail() {
        when(alertRepository.save(any(Alert.class))).thenReturn(testAlert);

        alertService.createAndSendAlert(testIncident);

        verify(emailService, times(1)).sendAlertEmail(anyString(), anyString(), any(Incident.class));
    }

    @Test
    void resendAlert_whenAlertNotFound_shouldThrowException() {
        when(alertRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            alertService.resendAlert(999L);
        });
    }

    @Test
    void acknowledgeAlert_shouldSetAcknowledgedAtAndFlag() {
        when(alertRepository.findById(1L)).thenReturn(Optional.of(testAlert));
        when(alertRepository.save(any(Alert.class))).thenReturn(testAlert);

        alertService.acknowledgeAlert(1L);

        assertTrue(testAlert.getAcknowledged());
        assertNotNull(testAlert.getAcknowledgedAt());
    }

    @Test
    void getCriticalUnacknowledgedAlerts_shouldReturnOnlyHighSeverityUnacknowledged() {
        Alert highAlert = Alert.builder().id(1L).severity(Severity.HIGH).acknowledged(false).build();
        Alert mediumAlert = Alert.builder().id(2L).severity(Severity.MEDIUM).acknowledged(false).build();

        when(alertRepository.findCriticalUnacknowledged(Severity.HIGH))
                .thenReturn(Arrays.asList(highAlert));

        List<Alert> result = alertService.getCriticalUnacknowledgedAlerts();

        assertNotNull(result);
        assertTrue(result.stream().allMatch(a -> a.getSeverity() == Severity.HIGH));
    }

    @Test
    void findById_whenExists_shouldReturnAlert() {
        when(alertRepository.findById(1L)).thenReturn(Optional.of(testAlert));

        Alert result = alertService.findById(1L);

        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void findById_whenNotFound_shouldThrowException() {
        when(alertRepository.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            alertService.findById(999L);
        });
    }

    @Test
    void getRecentAlerts_shouldReturnLimitedList() {
        List<Alert> mockAlerts = Arrays.asList(testAlert, testAlert);
        when(alertRepository.findRecentAlerts(any())).thenReturn(mockAlerts);

        List<Alert> result = alertService.getRecentAlerts(10);

        assertNotNull(result);
        assertEquals(2, result.size());
    }
}
