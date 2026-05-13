package ma.urbanops.service;

import ma.urbanops.dto.response.StatsResponse;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Role;
import ma.urbanops.enums.Severity;
import ma.urbanops.repository.AlertRepository;
import ma.urbanops.repository.IncidentRepository;
import ma.urbanops.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class StatsServiceTest {

    @Mock private IncidentRepository incidentRepository;
    @Mock private UserRepository userRepository;
    @Mock private AlertRepository alertRepository;

    @InjectMocks private StatsService statsService;

    @BeforeAll
    static void initAll() {
        System.out.println("=== Starting StatsService Tests ===");
    }

    @BeforeEach
    void setUp() {
        // Setup default mock responses
        when(incidentRepository.count()).thenReturn(100L);
        when(incidentRepository.countByStatus(IncidentStatus.OPEN)).thenReturn(30L);
        when(incidentRepository.countByStatus(IncidentStatus.IN_PROGRESS)).thenReturn(20L);
        when(incidentRepository.countByStatus(IncidentStatus.RESOLVED)).thenReturn(50L);
        when(incidentRepository.countBySeverity(Severity.HIGH)).thenReturn(15L);
        when(userRepository.countByRole(Role.CITIZEN)).thenReturn(150L);
        when(incidentRepository.countByCategoryGrouped()).thenReturn(Arrays.asList(
            new Object[]{"Transport", 25L},
            new Object[]{"Eau", 15L}
        ));
        when(incidentRepository.countBySectorGrouped()).thenReturn(Arrays.asList(
            new Object[]{"Guéliz", 30L},
            new Object[]{"Médina", 20L}
        ));
        when(incidentRepository.countResolvedSince(any(LocalDateTime.class))).thenReturn(5L);
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== StatsService Tests Complete ===");
    }

    @Test
    void getDashboardStats_shouldReturnNonNullResponse() {
        StatsResponse result = statsService.getDashboardStats();

        assertNotNull(result);
        assertNotNull(result.getTotalIncidents());
        assertNotNull(result.getOpenIncidents());
        assertNotNull(result.getResolvedIncidents());
    }

    @Test
    void getResolutionRate_shouldCalculateCorrectly() {
        when(incidentRepository.count()).thenReturn(100L);
        when(incidentRepository.countByStatus(IncidentStatus.RESOLVED)).thenReturn(50L);

        double result = statsService.getResolutionRate();

        assertEquals(50.0, result, 0.01);
    }

    @Test
    void getResolutionRate_whenNoIncidents_shouldReturnZero() {
        when(incidentRepository.count()).thenReturn(0L);

        double result = statsService.getResolutionRate();

        assertEquals(0.0, result, 0.01);
    }

    @Test
    void getResolutionRate_whenAllResolved_shouldReturnHundred() {
        when(incidentRepository.count()).thenReturn(100L);
        when(incidentRepository.countByStatus(IncidentStatus.RESOLVED)).thenReturn(100L);

        double result = statsService.getResolutionRate();

        assertEquals(100.0, result, 0.01);
    }

    @Test
    void getStatsByCategory_shouldReturnCategoryCounts() {
        List<StatsResponse.CategoryCount> result = statsService.getStatsByCategory();

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertTrue(result.stream().anyMatch(c -> c.getCategory().equals("Transport")));
    }

    @Test
    void getStatsByCategory_whenNoData_shouldReturnEmptyList() {
        when(incidentRepository.countByCategoryGrouped()).thenReturn(Collections.emptyList());

        List<StatsResponse.CategoryCount> result = statsService.getStatsByCategory();

        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void getStatsBySector_shouldReturnSectorCounts() {
        List<StatsResponse.SectorCount> result = statsService.getStatsBySector();

        assertNotNull(result);
        assertFalse(result.isEmpty());
    }

    @Test
    void getServicesHealth_shouldReturnPercentageValues() {
        when(incidentRepository.count()).thenReturn(100L);

        List<StatsResponse.ServiceHealth> result = statsService.getServicesHealth();

        assertNotNull(result);
        for (StatsResponse.ServiceHealth health : result) {
            assertNotNull(health.getServiceName());
            assertNotNull(health.getPercentage());
            assertTrue(health.getPercentage() >= 0 && health.getPercentage() <= 100);
        }
    }

    @Test
    void getDashboardStats_shouldIncludeAllFields() {
        StatsResponse result = statsService.getDashboardStats();

        assertNotNull(result.getTotalIncidents());
        assertNotNull(result.getOpenIncidents());
        assertNotNull(result.getInProgressIncidents());
        assertNotNull(result.getResolvedIncidents());
        assertNotNull(result.getHighSeverityCount());
        assertNotNull(result.getTotalCitizens());
        assertNotNull(result.getResolutionRate());
        assertNotNull(result.getIncidentsByCategory());
        assertNotNull(result.getIncidentsBySector());
    }
}
