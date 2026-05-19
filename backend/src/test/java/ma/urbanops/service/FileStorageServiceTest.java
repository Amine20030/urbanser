package ma.urbanops.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

class FileStorageServiceTest {

    @TempDir
    Path tempDir;

    private FileStorageService fileStorageService;

    @BeforeEach
    void setUp() {
        fileStorageService = new FileStorageService();
        ReflectionTestUtils.setField(fileStorageService, "uploadDir", tempDir.toString());
        fileStorageService.init();
    }

    @Test
    void storeFile_withValidFile_shouldReturnStoredName() {
        MockMultipartFile file = new MockMultipartFile(
                "photo", "test.jpg", "image/jpeg", "image-data".getBytes());

        String stored = fileStorageService.storeFile(file);

        assertNotNull(stored);
        assertTrue(stored.endsWith(".jpg"));
        assertTrue(Files.exists(fileStorageService.loadFile(stored)));
    }

    @Test
    void storeFile_withEmptyFile_shouldReturnNull() {
        MockMultipartFile file = new MockMultipartFile("photo", "empty.jpg", "image/jpeg", new byte[0]);
        assertNull(fileStorageService.storeFile(file));
    }

    @Test
    void storeFile_withPathTraversal_shouldThrow() {
        MockMultipartFile file = new MockMultipartFile(
                "photo", "../evil.jpg", "image/jpeg", "data".getBytes());

        assertThrows(IllegalArgumentException.class, () -> fileStorageService.storeFile(file));
    }

    @Test
    void storeFile_whenIOException_shouldThrow() throws Exception {
        MultipartFile file = mock(MultipartFile.class);
        when(file.isEmpty()).thenReturn(false);
        when(file.getOriginalFilename()).thenReturn("broken.jpg");
        when(file.getInputStream()).thenThrow(new IOException("disk error"));

        assertThrows(IllegalStateException.class, () -> fileStorageService.storeFile(file));
    }

    @Test
    void deleteFile_whenMissing_shouldNotThrow() {
        fileStorageService.deleteFile("missing-file.jpg");
    }

    @Test
    void deleteFile_whenExists_shouldRemoveFile() throws Exception {
        MockMultipartFile file = new MockMultipartFile(
                "photo", "delete-me.jpg", "image/jpeg", "data".getBytes());
        String stored = fileStorageService.storeFile(file);
        assertNotNull(stored);

        fileStorageService.deleteFile(stored);

        assertFalse(Files.exists(fileStorageService.loadFile(stored)));
    }
}
