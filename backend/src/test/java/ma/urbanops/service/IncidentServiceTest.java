package ma.urbanops.service;

import ma.urbanops.entity.Incident;
import ma.urbanops.entity.User;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Severity;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.CategoryRepository;
import ma.urbanops.repository.IncidentRepository;
import ma.urbanops.repository.SectorRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock private IncidentRepository incidentRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private SectorRepository sectorRepository;
    @Mock private FileStorageService fileStorageService;
    @Mock private AIAnalysisService aiAnalysisService;
    @Mock private AlertService alertService;

    @InjectMocks private IncidentService incidentService;

    private Incident testIncident;
    private User testUser;

    @BeforeAll
    static void initAll() {
        System.out.println("=== Starting IncidentService Tests ===");
    }

    @BeforeEach
    void setUp() {
        testUser = new User();
        testUser.setId(1L);
        testUser.setEmail("test@marrakech.ma");
        testUser.setFirstName("Yassine");

        testIncident = new Incident();
        testIncident.setId(1L);
        testIncident.setReferenceCode("INC-1001");
        testIncident.setTitle("Fuite d'eau Bab Doukkala");
        testIncident.setSeverity(Severity.HIGH);
        testIncident.setStatus(IncidentStatus.OPEN);
        testIncident.setLatitude(31.6330);
        testIncident.setLongitude(-7.9990);
    }

    @AfterEach
    void tearDown() {
        // cleanup if needed
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== IncidentService Tests Complete ===");
    }

    @Test
    void getById_whenIncidentExists_shouldReturnIncident() {
        when(incidentRepository.findById(1L)).thenReturn(Optional.of(testIncident));
        Incident result = incidentService.getById(1L);
        assertNotNull(result);
        assertEquals("INC-1001", result.getReferenceCode());
        assertEquals(Severity.HIGH, result.getSeverity());
    }

    @Test
    void getById_whenIncidentNotFound_shouldThrowResourceNotFoundException() {
        when(incidentRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> {
            incidentService.getById(999L);
        });
    }

    @Test
    void getById_whenIdIsNull_shouldThrowException() {
        assertThrows(Exception.class, () -> {
            incidentService.getById(null);
        });
    }

    @Test
    void updateStatus_whenValidTransition_shouldUpdateAndSave() {
        when(incidentRepository.findById(1L)).thenReturn(Optional.of(testIncident));
        when(incidentRepository.save(any(Incident.class))).thenReturn(testIncident);

        Incident result = incidentService.updateStatus(1L, ma.urbanops.dto.request.UpdateStatusRequest.builder()
                .status(IncidentStatus.IN_PROGRESS).build());

        assertNotNull(result);
        assertEquals(IncidentStatus.IN_PROGRESS, result.getStatus());
        verify(incidentRepository, times(1)).save(any(Incident.class));
    }

    @Test
    void updateStatus_whenResolvedStatus_shouldSetResolvedAt() {
        when(incidentRepository.findById(1L)).thenReturn(Optional.of(testIncident));
        when(incidentRepository.save(any(Incident.class))).thenAnswer(inv -> inv.getArgument(0));

        Incident result = incidentService.updateStatus(1L, ma.urbanops.dto.request.UpdateStatusRequest.builder()
                .status(IncidentStatus.RESOLVED).build());

        assertNotNull(result.getResolvedAt());
        assertEquals(IncidentStatus.RESOLVED, result.getStatus());
    }

    @Test
    void getRecentIncidents_shouldReturnLimitedList() {
        java.util.List<Incident> mockList = java.util.List.of(testIncident, testIncident, testIncident);
        when(incidentRepository.findTopNByOrderByCreatedAtDesc(any())).thenReturn(mockList);

        java.util.List<Incident> result = incidentService.getRecentIncidents(10);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.size() <= 10);
    }

    @Test
    void generateReferenceCode_shouldMatchExpectedFormat() {
        String code = incidentService.generateReferenceCode(1001L);
        assertNotNull(code);
        assertTrue(code.startsWith("INC-"));
        assertEquals("INC-1001", code);
    }

    @Test
    void getByReference_whenExists_shouldReturnIncident() {
        when(incidentRepository.findByReferenceCode("INC-1001")).thenReturn(Optional.of(testIncident));
        Incident result = incidentService.getByReference("INC-1001");
        assertNotNull(result);
        assertEquals("INC-1001", result.getReferenceCode());
    }

    @Test
    void deleteIncident_whenCalled_shouldDeleteFromRepository() {
        when(incidentRepository.findById(1L)).thenReturn(Optional.of(testIncident));
        doNothing().when(incidentRepository).delete(any(Incident.class));
        
        incidentService.deleteIncident(1L);
        
        verify(incidentRepository, times(1)).delete(testIncident);
    }

    @Test
    @Disabled("Désactivé: dépend de l'API AI externe — à tester en intégration")
    void createIncident_withAIAnalysis_shouldSetSeverityFromAI() {
        fail("Test désactivé intentionnellement - requires real AI API");
    }
}
