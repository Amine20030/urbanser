package ma.urbanops.service;

import ma.urbanops.dto.request.IncidentRequest;
import ma.urbanops.dto.response.AIAnalysisResult;
import ma.urbanops.dto.response.ContentModerationResult;
import ma.urbanops.entity.Alert;
import ma.urbanops.entity.Category;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.Sector;
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
import org.springframework.data.jpa.domain.Specification;
import org.springframework.mock.web.MockMultipartFile;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock private IncidentRepository incidentRepository;
    @Mock private CategoryRepository categoryRepository;
    @Mock private SectorRepository sectorRepository;
    @Mock private FileStorageService fileStorageService;
    @Mock private AIAnalysisService aiAnalysisService;
    @Mock private AlertService alertService;
    @Mock private IncidentContentModerationLogService moderationLogService;

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
    void deleteIncident_withPhoto_shouldDeleteStoredFile() {
        testIncident.setPhotoUrl("photo.jpg");
        when(incidentRepository.findById(1L)).thenReturn(Optional.of(testIncident));
        incidentService.deleteIncident(1L);
        verify(fileStorageService).deleteFile("photo.jpg");
        verify(incidentRepository).delete(testIncident);
    }

    @Test
    void getByReference_withInvalidNumber_shouldKeepOriginalCode() {
        when(incidentRepository.findByReferenceCode("INC-ABC")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> incidentService.getByReference("INC-ABC"));
    }

    @Test
    void getByReference_whenNotFound_shouldThrow() {
        when(incidentRepository.findByReferenceCode("INC-9999")).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> incidentService.getByReference("INC-9999"));
    }

    @Test
    void updateStatus_whenNotFound_shouldThrow() {
        when(incidentRepository.findById(99L)).thenReturn(Optional.empty());
        var request = ma.urbanops.dto.request.UpdateStatusRequest.builder()
                .status(IncidentStatus.RESOLVED).build();
        assertThrows(ResourceNotFoundException.class, () -> incidentService.updateStatus(99L, request));
    }

    @Test
    void getRecentIncidents_whenEmpty_shouldReturnEmptyList() {
        when(incidentRepository.findTopNByOrderByCreatedAtDesc(any())).thenReturn(java.util.List.of());
        assertTrue(incidentService.getRecentIncidents(10).isEmpty());
    }

    @Test
    void deleteIncident_whenNotFound_shouldThrow() {
        when(incidentRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> incidentService.deleteIncident(99L));
    }

    @Test
    void getMyIncidents_shouldReturnUserIncidents() {
        when(incidentRepository.findByReportedBy(testUser)).thenReturn(java.util.List.of(testIncident));
        java.util.List<Incident> result = incidentService.getMyIncidents(testUser);
        assertEquals(1, result.size());
    }

    @Test
    void getAllForMap_shouldReturnIncidents() {
        when(incidentRepository.findAllForMap()).thenReturn(java.util.List.of(testIncident));
        assertFalse(incidentService.getAllForMap().isEmpty());
    }

    @Test
    void getByReference_shouldNormalizeIncFormat() {
        when(incidentRepository.findByReferenceCode("INC-0001")).thenReturn(Optional.of(testIncident));
        Incident result = incidentService.getByReference("INC-1");
        assertEquals("INC-1001", result.getReferenceCode());
    }

    @Test
    void getBySector_whenSectorExists_shouldReturnIncidents() {
        Sector sector = Sector.builder().id(1L).name("Gueliz").build();
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(sector));
        when(incidentRepository.findAll(any(Specification.class))).thenReturn(java.util.List.of(testIncident));
        assertEquals(1, incidentService.getBySector(1L).size());
    }

    @Test
    void getBySector_whenSectorNotFound_shouldThrow() {
        when(sectorRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> incidentService.getBySector(99L));
    }

    @Test
    void getByCategory_whenCategoryNotFound_shouldThrow() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> incidentService.getByCategory(99L));
    }

    @Test
    void getByCategory_whenCategoryExists_shouldReturnIncidents() {
        Category category = Category.builder().id(1L).name("Eau").build();
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(incidentRepository.findAll(any(Specification.class))).thenReturn(java.util.List.of(testIncident));
        assertEquals(1, incidentService.getByCategory(1L).size());
    }

    @Test
    void createIncident_whenModerationRejects_shouldNotPersistIncidentOrPhoto() {
        Category category = Category.builder().id(1L).name("Voirie").build();
        Sector sector = Sector.builder().id(1L).name("Gueliz").build();
        IncidentRequest request = IncidentRequest.builder()
                .title("azerty qwerty")
                .description("asdf asdf asdf random test")
                .categoryId(category.getId())
                .sectorId(sector.getId())
                .latitude(31.63)
                .longitude(-8.0)
                .build();

        when(categoryRepository.findById(category.getId())).thenReturn(Optional.of(category));
        when(sectorRepository.findById(sector.getId())).thenReturn(Optional.of(sector));
        when(aiAnalysisService.moderateIncidentContent(
                request.getTitle(), request.getDescription(), category.getName(), sector.getName()))
                .thenReturn(ContentModerationResult.builder()
                        .accepted(false)
                        .reason("Contenu aleatoire")
                        .confidence(0.9)
                        .fallbackUsed(false)
                        .build());

        IllegalArgumentException ex = assertThrows(IllegalArgumentException.class,
                () -> incidentService.createIncident(request, null, testUser));

        assertTrue(ex.getMessage().contains("Signalement refuse"));
        verify(moderationLogService).log(null, request.getTitle(), request.getDescription(),
                category, sector, testUser, ContentModerationResult.builder()
                        .accepted(false)
                        .reason("Contenu aleatoire")
                        .confidence(0.9)
                        .fallbackUsed(false)
                        .build());
        verify(incidentRepository, never()).save(any(Incident.class));
        verify(fileStorageService, never()).storeFile(any());
    }

    @Test
    void createIncident_whenAiAnalysisFails_shouldUseSafeDefaults() {
        Category category = Category.builder().id(1L).name("Eau").defaultAuthority("RADEEMA").build();
        Sector sector = Sector.builder().id(1L).name("Gueliz").build();
        IncidentRequest request = IncidentRequest.builder()
                .title("Fuite d'eau")
                .description("Fuite d'eau importante dans la rue principale du quartier")
                .categoryId(1L)
                .sectorId(1L)
                .latitude(31.63)
                .longitude(-8.0)
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(sector));
        when(aiAnalysisService.moderateIncidentContent(any(), any(), any(), any()))
                .thenReturn(ContentModerationResult.builder().accepted(true).reason("OK").build());
        when(aiAnalysisService.analyze(any(), any())).thenThrow(new RuntimeException("AI down"));
        when(incidentRepository.save(any(Incident.class))).thenAnswer(inv -> {
            Incident inc = inv.getArgument(0);
            if (inc.getId() == null) {
                inc.setId(6L);
            }
            return inc;
        });

        Incident result = incidentService.createIncident(request, null, testUser);

        assertEquals(Severity.MEDIUM, result.getSeverity());
        assertEquals("RADEEMA", result.getAuthorityNotified());
    }

    @Test
    void createIncident_withPhoto_shouldStoreFile() {
        Category category = Category.builder().id(1L).name("Eau").defaultAuthority("RADEEMA").build();
        Sector sector = Sector.builder().id(1L).name("Gueliz").build();
        IncidentRequest request = IncidentRequest.builder()
                .title("Fuite d'eau")
                .description("Fuite d'eau importante dans la rue principale du quartier")
                .categoryId(1L)
                .sectorId(1L)
                .latitude(31.63)
                .longitude(-8.0)
                .build();
        MockMultipartFile photo = new MockMultipartFile(
                "photo", "photo.jpg", "image/jpeg", "bytes".getBytes());

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(sector));
        when(aiAnalysisService.moderateIncidentContent(any(), any(), any(), any()))
                .thenReturn(ContentModerationResult.builder().accepted(true).reason("OK").build());
        when(aiAnalysisService.analyze(any(), any()))
                .thenReturn(AIAnalysisResult.builder().severity("LOW").authorityName("RADEEMA").build());
        when(fileStorageService.storeFile(photo)).thenReturn("stored.jpg");
        when(incidentRepository.save(any(Incident.class))).thenAnswer(inv -> {
            Incident inc = inv.getArgument(0);
            if (inc.getId() == null) {
                inc.setId(7L);
            }
            return inc;
        });

        Incident result = incidentService.createIncident(request, photo, testUser);

        assertEquals("stored.jpg", result.getPhotoUrl());
        verify(fileStorageService).storeFile(photo);
    }

    @Test
    void createIncident_whenAccepted_shouldPersistAndNotify() {
        Category category = Category.builder().id(1L).name("Eau").defaultAuthority("RADEEMA").build();
        Sector sector = Sector.builder().id(1L).name("Gueliz").build();
        IncidentRequest request = IncidentRequest.builder()
                .title("Fuite d'eau")
                .description("Fuite d'eau importante dans la rue principale du quartier")
                .categoryId(1L)
                .sectorId(1L)
                .latitude(31.63)
                .longitude(-8.0)
                .build();

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(category));
        when(sectorRepository.findById(1L)).thenReturn(Optional.of(sector));
        when(aiAnalysisService.moderateIncidentContent(
                request.getTitle(), request.getDescription(), category.getName(), sector.getName()))
                .thenReturn(ContentModerationResult.builder()
                        .accepted(true)
                        .reason("OK")
                        .confidence(0.9)
                        .fallbackUsed(false)
                        .build());
        when(aiAnalysisService.analyze(request.getDescription(), category.getName()))
                .thenReturn(AIAnalysisResult.builder()
                        .severity("HIGH")
                        .authorityName("RADEEMA")
                        .reason("Fuite detectee")
                        .confidence(0.9)
                        .fallbackUsed(false)
                        .build());
        when(incidentRepository.save(any(Incident.class))).thenAnswer(inv -> {
            Incident inc = inv.getArgument(0);
            if (inc.getId() == null) {
                inc.setId(5L);
            }
            return inc;
        });
        when(alertService.createAndSendAlert(any(Incident.class))).thenReturn(Alert.builder().id(1L).build());

        Incident result = incidentService.createIncident(request, null, testUser);

        assertNotNull(result);
        assertEquals(Severity.HIGH, result.getSeverity());
        verify(alertService).createAndSendAlert(any(Incident.class));
        verify(moderationLogService, times(1)).log(eq(5L), eq(request.getTitle()), eq(request.getDescription()),
                eq(category), eq(sector), eq(testUser), any(ContentModerationResult.class));
    }

    @Test
    @Disabled("Désactivé: dépend de l'API AI externe — à tester en intégration")
    void createIncident_withAIAnalysis_shouldSetSeverityFromAI() {
        fail("Test désactivé intentionnellement - requires real AI API");
    }
}
