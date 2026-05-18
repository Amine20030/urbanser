package ma.urbanops.service;

import ma.urbanops.dto.response.CategoryResponse;
import ma.urbanops.entity.Category;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.CategoryRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock private CategoryRepository categoryRepository;
    @InjectMocks private CategoryService categoryService;

    private Category testCategory;

    @BeforeAll
    static void initAll() {
        System.out.println("=== CategoryServiceTest START ===");
    }

    @BeforeEach
    void setUp() {
        testCategory = Category.builder()
                .id(1L)
                .name("Transport")
                .icon("🚌")
                .defaultAuthority("Police Circulation")
                .authorityEmail("police@marrakech.ma")
                .build();
    }

    @AfterEach
    void tearDown() {
        System.out.println("CategoryService test done");
    }

    @AfterAll
    static void cleanAll() {
        System.out.println("=== CategoryServiceTest END ===");
    }

    @Test
    void findAll_shouldReturnAllCategories() {
        when(categoryRepository.findAll()).thenReturn(List.of(testCategory));
        List<Category> result = categoryService.findAll();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("Transport", result.get(0).getName());
    }

    @Test
    void findAll_whenEmpty_shouldReturnEmptyList() {
        when(categoryRepository.findAll()).thenReturn(List.of());
        List<Category> result = categoryService.findAll();
        assertNotNull(result);
        assertTrue(result.isEmpty());
    }

    @Test
    void findAll_resultShouldNeverBeNull() {
        when(categoryRepository.findAll()).thenReturn(List.of());
        assertNotNull(categoryService.findAll());
    }

    @Test
    void findById_whenExists_shouldReturnCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        Category result = categoryService.findById(1L);
        assertNotNull(result);
        assertEquals("Transport", result.getName());
    }

    @Test
    void findById_whenNotFound_shouldThrowException() {
        when(categoryRepository.findById(999L)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> categoryService.findById(999L));
    }

    @Test
    void findById_shouldReturnCorrectIcon() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        Category result = categoryService.findById(1L);
        assertEquals("🚌", result.getIcon());
        assertNotNull(result.getAuthorityEmail());
    }

    @Test
    void create_withValidCategory_shouldPersist() {
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        Category result = categoryService.create(testCategory);
        assertNotNull(result);
        verify(categoryRepository, times(1)).save(any(Category.class));
    }

    @Test
    void create_shouldReturnSavedCategory() {
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);
        Category result = categoryService.create(testCategory);
        assertEquals("Transport", result.getName());
        assertNotNull(result.getId());
    }

    @Test
    void update_shouldApplyChanges() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(testCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(testCategory);

        Category patch = Category.builder().name("Eau").icon("💧").build();
        Category result = categoryService.update(1L, patch);

        assertEquals("Eau", result.getName());
        verify(categoryRepository).save(testCategory);
    }

    @Test
    void delete_shouldCallRepository() {
        categoryService.delete(1L);
        verify(categoryRepository).deleteById(1L);
    }

    @Test
    void toResponse_shouldMapFields() {
        CategoryResponse response = categoryService.toResponse(testCategory);
        assertEquals(1L, response.getId());
        assertEquals("Transport", response.getName());
        assertEquals("police@marrakech.ma", response.getAuthorityEmail());
    }

    @Test
    @Disabled("Test d'intégration — nécessite une base de données réelle")
    void create_withDuplicateName_shouldThrowException() {
        fail("Test d'intégration désactivé — exécuter avec profil 'integration'");
    }
}
