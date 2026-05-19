package ma.urbanops.service;

import ma.urbanops.dto.response.StatsResponse;
import ma.urbanops.entity.Category;
import ma.urbanops.entity.Incident;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Role;
import ma.urbanops.enums.Severity;
import ma.urbanops.repository.AlertRepository;
import ma.urbanops.repository.IncidentRepository;
import ma.urbanops.repository.UserRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
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

    @AfterEach
    void tearDown() {
        System.out.println("StatsService test completed");
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== StatsService Tests Complete ===");
    }

    @Test
    void getDashboardStats_shouldReturnNonNullResponse() {
        StatsResponse result = statsService.getDashboardStats();

        assertNotNull(result);
        assertTrue(result.getTotalIncidents() >= 0);
        assertTrue(result.getOpenIncidents() >= 0);
        assertTrue(result.getResolvedIncidents() >= 0);
    }

    @Test
    void getResolutionRate_shouldCalculateCorrectly() {
        when(incidentRepository.count()).thenReturn(100L);
        when(incidentRepository.countByStatus(IncidentStatus.RESOLVED)).thenReturn(50L);

        double result = statsService.getResolutionRate();

        assertEquals(50.0, result, 0.01);
    }

    @ParameterizedTest(name = "total={0} resolved={1} expected={2}")
    @CsvSource({
        "0, 0, 0.0",
        "5, 0, 0.0",
        "5, 5, 100.0"
    })
    void getResolutionRate_parameterized(long total, long resolved, double expected) {
        when(incidentRepository.count()).thenReturn(total);
        if (total > 0) {
            when(incidentRepository.countByStatus(IncidentStatus.RESOLVED)).thenReturn(resolved);
        }
        double result = statsService.getResolutionRate();
        assertEquals(expected, result, 0.01);
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
            assertTrue(health.getPercentage() >= 0 && health.getPercentage() <= 100);
        }
    }

    @Test
    void getServicesHealth_shouldUseRealResolutionRateWithoutMinimumFloor() {
        Category transport = Category.builder().name("Transport").build();
        Category water = Category.builder().name("Eau").build();
        when(incidentRepository.findAll()).thenReturn(List.of(
                Incident.builder().category(transport).status(IncidentStatus.OPEN).build(),
                Incident.builder().category(transport).status(IncidentStatus.OPEN).build(),
                Incident.builder().category(water).status(IncidentStatus.RESOLVED).build(),
                Incident.builder().category(water).status(IncidentStatus.OPEN).build()
        ));

        List<StatsResponse.ServiceHealth> result = statsService.getServicesHealth();

        StatsResponse.ServiceHealth transportHealth = result.stream()
                .filter(h -> h.getServiceName().equals("Transport"))
                .findFirst()
                .orElseThrow();
        StatsResponse.ServiceHealth waterHealth = result.stream()
                .filter(h -> h.getServiceName().equals("Eau"))
                .findFirst()
                .orElseThrow();

        assertEquals(0, transportHealth.getPercentage());
        assertEquals(50, waterHealth.getPercentage());
    }

    @Test
    void getHourlyStats_shouldReturnTwentyFourBuckets() {
        List<java.util.Map<String, Object>> hourly = statsService.getHourlyStats();

        assertNotNull(hourly);
        assertEquals(24, hourly.size());
        assertTrue(hourly.stream().allMatch(m -> m.containsKey("hour") && m.containsKey("count")));
    }

    @Test
    void getHourlyStats_whenNoIncidents_shouldReturnZeroCounts() {
        when(incidentRepository.findAll()).thenReturn(Collections.emptyList());

        List<java.util.Map<String, Object>> hourly = statsService.getHourlyStats();

        assertEquals(24, hourly.size());
        assertTrue(hourly.stream().allMatch(m -> ((Number) m.get("count")).longValue() == 0L));
    }

    @Test
    void getHourlyStats_shouldCountIncidentsInMatchingHour() {
        Incident inc = Incident.builder()
                .createdAt(LocalDateTime.of(2026, 5, 18, 14, 30))
                .build();
        when(incidentRepository.findAll()).thenReturn(List.of(inc));

        List<java.util.Map<String, Object>> hourly = statsService.getHourlyStats();
        java.util.Map<String, Object> hour14 = hourly.get(14);

        assertEquals(1L, ((Number) hour14.get("count")).longValue());
        assertEquals("14h", hour14.get("hour"));
    }

    @Test
    void getDashboardStats_shouldIncludeAllFields() {
        StatsResponse result = statsService.getDashboardStats();

        assertTrue(result.getTotalIncidents() >= 0);
        assertTrue(result.getOpenIncidents() >= 0);
        assertTrue(result.getInProgressIncidents() >= 0);
        assertTrue(result.getResolvedIncidents() >= 0);
        assertTrue(result.getHighSeverityCount() >= 0);
        assertTrue(result.getTotalCitizens() >= 0);
        assertTrue(result.getResolutionRate() >= 0);
        assertNotNull(result.getIncidentsByCategory());
        assertNotNull(result.getIncidentsBySector());
    }
}
