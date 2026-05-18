package ma.urbanops.service;

import ma.urbanops.dto.response.SectorResponse;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.Sector;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.IncidentRepository;
import ma.urbanops.repository.SectorRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import org.springframework.data.jpa.domain.Specification;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SectorServiceTest {

    @Mock private SectorRepository sectorRepository;
    @Mock private IncidentRepository incidentRepository;
    @InjectMocks private SectorService sectorService;

    private Sector testSector;

    @BeforeAll
    static void initAll() {
        System.out.println("=== SectorServiceTest START ===");
    }

    @BeforeEach
    void setUp() {
        testSector = Sector.builder()
                .id(1L)
                .name("Guéliz")
                .city("Marrakech")
                .centerLat(31.6347)
                .centerLng(-8.0083)
                .build();
    }

    @AfterEach
    void tearDown() {
        System.out.println("SectorService test done");
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== SectorServiceTest END ===");
    }

    @Test
    void findAll_shouldReturnAllSectors() {
        when(sectorRepository.findAll()).thenReturn(List.of(testSector));
        List<Sector> result = sectorService.findAll();
        assertNotNull(result);
        assertEquals(1, result.size());
    }

    @Test
    void findAll_whenEmpty_shouldReturnEmptyList() {
        when(sectorRepository.findAll()).thenReturn(List.of());
        assertTrue(sectorService.findAll().isEmpty());
    }

    @Test
    void findAll_cityNameShouldBeMarrakech() {
        when(sectorRepository.findAll()).thenReturn(List.of(testSector));
        List<Sector> result = sectorService.findAll();
        assertEquals("Marrakech", result.get(0).getCity());
    }

    @Test
    void findById_whenExists_shouldReturnSector() {
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(testSector));
        Sector result = sectorService.findById(1L);
        assertNotNull(result);
        assertEquals("Guéliz", result.getName());
    }

    @Test
    void findById_whenNotFound_shouldThrow() {
        when(sectorRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> sectorService.findById(99L));
    }

    @Test
    void findById_shouldReturnCorrectCoordinates() {
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(testSector));
        Sector result = sectorService.findById(1L);
        assertNotNull(result.getCenterLat());
        assertNotNull(result.getCenterLng());
        assertTrue(result.getCenterLat() > 30 && result.getCenterLat() < 32);
    }

    @Test
    void create_shouldPersistAndReturn() {
        when(sectorRepository.save(any(Sector.class))).thenReturn(testSector);
        Sector result = sectorService.create(testSector);
        assertNotNull(result);
        verify(sectorRepository).save(any(Sector.class));
    }

    @Test
    void create_shouldReturnSectorWithId() {
        when(sectorRepository.save(any(Sector.class))).thenReturn(testSector);
        Sector result = sectorService.create(testSector);
        assertNotNull(result.getId());
    }

    @Test
    void findByCity_shouldDelegateToRepository() {
        when(sectorRepository.findByCity("Marrakech")).thenReturn(List.of(testSector));
        List<Sector> result = sectorService.findByCity("Marrakech");
        assertEquals(1, result.size());
    }

    @Test
    void getIncidentsBySector_shouldReturnIncidents() {
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(testSector));
        when(incidentRepository.findAll(any(Specification.class))).thenReturn(List.of(new Incident()));

        List<Incident> result = sectorService.getIncidentsBySector(1L);

        assertEquals(1, result.size());
    }

    @Test
    void toResponse_shouldMapFields() {
        SectorResponse response = sectorService.toResponse(testSector);
        assertEquals(1L, response.getId());
        assertEquals("Guéliz", response.getName());
        assertEquals("Marrakech", response.getCity());
    }

    @Test
    @Disabled("Nécessite base de données — test d'intégration")
    void create_withInvalidData_shouldFail() {
        fail("Test d'intégration désactivé intentionnellement");
    }
}
