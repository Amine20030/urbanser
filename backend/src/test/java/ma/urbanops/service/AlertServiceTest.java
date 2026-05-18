package ma.urbanops.service;

import ma.urbanops.entity.Alert;
import ma.urbanops.entity.Category;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.Sector;
import ma.urbanops.enums.Severity;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.jms.AlertProducer;
import ma.urbanops.repository.AlertRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class AlertServiceTest {

    @Mock private AlertRepository alertRepository;
    @Mock private AlertProducer alertProducer;
    @InjectMocks private AlertService alertService;

    private Alert testAlert;
    private Incident testIncident;

    @BeforeAll
    static void initAll() {
        System.out.println("=== AlertServiceTest START ===");
    }

    @BeforeEach
    void setUp() {
        Category cat = Category.builder()
                .name("Électricité")
                .authorityEmail("onee@test.ma")
                .defaultAuthority("ONEE")
                .build();

        Sector sector = Sector.builder().name("Guéliz").build();

        testIncident = Incident.builder()
                .id(1L)
                .referenceCode("INC-0001")
                .title("Câble exposé")
                .description("Câble HT visible")
                .severity(Severity.HIGH)
                .category(cat)
                .sector(sector)
                .build();

        testAlert = Alert.builder()
                .id(1L)
                .incident(testIncident)
                .severity(Severity.HIGH)
                .title("Câble exposé")
                .emailSent(false)
                .acknowledged(false)
                .build();
    }

    @AfterEach
    void tearDown() {
        System.out.println("Test completed");
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== AlertServiceTest END ===");
    }

    @Test
    void findById_whenAlertExists_shouldReturnAlert() {
        when(alertRepository.findById(1L)).thenReturn(Optional.of(testAlert));
        Alert result = alertService.findById(1L);
        assertNotNull(result);
        assertEquals(1L, result.getId());
    }

    @Test
    void findById_whenAlertNotFound_shouldThrowException() {
        when(alertRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> alertService.findById(999L));
    }

    @Test
    void findById_whenIdIsZero_shouldThrowException() {
        when(alertRepository.findById(0L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> alertService.findById(0L));
    }

    @Test
    void acknowledgeAlert_whenNotAcknowledged_shouldSetAcknowledgedTrue() {
        when(alertRepository.findById(1L)).thenReturn(Optional.of(testAlert));
        when(alertRepository.save(any(Alert.class))).thenAnswer(inv -> inv.getArgument(0));

        alertService.acknowledgeAlert(1L);

        assertTrue(testAlert.getAcknowledged());
        verify(alertRepository).save(testAlert);
    }

    @Test
    void acknowledgeAlert_whenAlreadyAcknowledged_shouldStillSave() {
        testAlert.setAcknowledged(true);
        when(alertRepository.findById(1L)).thenReturn(Optional.of(testAlert));
        when(alertRepository.save(any(Alert.class))).thenReturn(testAlert);

        alertService.acknowledgeAlert(1L);

        verify(alertRepository, times(1)).save(testAlert);
    }

    @Test
    void acknowledgeAlert_whenAlertNotFound_shouldThrowException() {
        when(alertRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> alertService.acknowledgeAlert(99L));
    }

    @Test
    void getRecentAlerts_shouldReturnList() {
        when(alertRepository.findRecentAlerts(any(Pageable.class))).thenReturn(List.of(testAlert));
        List<Alert> result = alertService.getRecentAlerts(10);
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void getRecentAlerts_whenEmpty_shouldReturnEmptyList() {
        when(alertRepository.findRecentAlerts(any(Pageable.class))).thenReturn(List.of());
        List<Alert> result = alertService.getRecentAlerts(10);
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getRecentAlerts_resultShouldNotBeNull() {
        when(alertRepository.findRecentAlerts(any(Pageable.class))).thenReturn(List.of(testAlert));
        assertNotNull(alertService.getRecentAlerts(5));
    }

    @Test
    void createAndSendAlert_withAuthorityEmail_shouldQueueAndMarkSent() {
        when(alertRepository.save(any(Alert.class))).thenAnswer(inv -> {
            Alert a = inv.getArgument(0);
            if (a.getId() == null) {
                a.setId(1L);
            }
            return a;
        });

        Alert result = alertService.createAndSendAlert(testIncident);

        assertNotNull(result);
        verify(alertProducer).sendAlertToQueue(testIncident);
        verify(alertRepository, atLeast(2)).save(any(Alert.class));
    }

    @Test
    void createAndSendAlert_withoutAuthorityEmail_shouldNotQueue() {
        testIncident.getCategory().setAuthorityEmail("");
        when(alertRepository.save(any(Alert.class))).thenAnswer(inv -> {
            Alert a = inv.getArgument(0);
            a.setId(2L);
            return a;
        });

        Alert result = alertService.createAndSendAlert(testIncident);

        assertNotNull(result);
        verify(alertProducer, never()).sendAlertToQueue(any());
    }

    @Test
    void resendAlert_whenFoundWithEmail_shouldResend() {
        when(alertRepository.findById(1L)).thenReturn(Optional.of(testAlert));
        when(alertRepository.save(any(Alert.class))).thenReturn(testAlert);

        alertService.resendAlert(1L);

        verify(alertProducer).sendAlertToQueue(testIncident);
        assertTrue(testAlert.getEmailSent());
    }

    @Test
    void resendAlert_whenNotFound_shouldThrow() {
        when(alertRepository.findById(42L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> alertService.resendAlert(42L));
    }

    @Test
    void getCriticalUnacknowledgedAlerts_shouldDelegateToRepository() {
        when(alertRepository.findCriticalUnacknowledged(Severity.HIGH)).thenReturn(List.of(testAlert));
        List<Alert> result = alertService.getCriticalUnacknowledgedAlerts();
        assertEquals(1, result.size());
    }
}
