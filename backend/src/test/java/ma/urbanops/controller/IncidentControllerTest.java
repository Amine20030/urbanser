package ma.urbanops.controller;

import ma.urbanops.entity.Incident;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Severity;
import ma.urbanops.service.IncidentService;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import java.util.Arrays;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class IncidentControllerTest {

    @Mock private IncidentService incidentService;

    @InjectMocks private IncidentController incidentController;

    private Incident testIncident;

    @BeforeAll
    static void initAll() {
        System.out.println("=== Starting IncidentController Tests ===");
    }

    @BeforeEach
    void setUp() {
        testIncident = Incident.builder()
                .id(1L)
                .referenceCode("INC-1001")
                .title("Test Incident")
                .severity(Severity.HIGH)
                .status(IncidentStatus.OPEN)
                .latitude(31.6330)
                .longitude(-7.9990)
                .build();
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== IncidentController Tests Complete ===");
    }

    @Test
    void getAllIncidents_shouldReturnPageOfIncidents() {
        List<Incident> incidents = Arrays.asList(testIncident);
        Page<Incident> page = new PageImpl<>(incidents);
        when(incidentService.getAllIncidents(any(), any(), any(), any(), any(), any(Pageable.class)))
                .thenReturn(page);

        ResponseEntity<?> result = incidentController.getAllIncidents(null, null, null, null, null, Pageable.ofSize(10));

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
    }

    @Test
    void getIncidentById_whenExists_shouldReturnIncident() {
        when(incidentService.getById(1L)).thenReturn(testIncident);

        ResponseEntity<?> result = incidentController.getIncidentById(1L);

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
    }

    @Test
    void getIncidentByReference_whenExists_shouldReturnIncident() {
        when(incidentService.getByReference("INC-1001")).thenReturn(testIncident);

        ResponseEntity<?> result = incidentController.getIncidentByReference("INC-1001");

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
    }

    @Test
    void getRecentIncidents_shouldReturnList() {
        List<Incident> incidents = Arrays.asList(testIncident, testIncident);
        when(incidentService.getRecentIncidents(10)).thenReturn(incidents);

        ResponseEntity<?> result = incidentController.getRecentIncidents();

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
    }

    @Test
    void getAllForMap_shouldReturnMapDTOs() {
        when(incidentService.getAllForMap()).thenReturn(Arrays.asList());

        ResponseEntity<?> result = incidentController.getAllForMap();

        assertNotNull(result);
        assertTrue(result.getStatusCode().is2xxSuccessful());
    }
}
