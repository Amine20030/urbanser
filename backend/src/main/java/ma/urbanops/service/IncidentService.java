package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.request.IncidentRequest;
import ma.urbanops.dto.request.UpdateStatusRequest;
import ma.urbanops.dto.response.AIAnalysisResponse;
import ma.urbanops.dto.response.IncidentMapDTO;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final CategoryRepository categoryRepository;
    private final SectorRepository sectorRepository;
    private final FileStorageService fileStorageService;
    private final AIAnalysisService aiAnalysisService;
    private final AlertService alertService;

    public Page<Incident> getAllIncidents(Long categoryId, Long sectorId, Severity severity, 
                                          IncidentStatus status, String keyword, Pageable pageable) {
        Specification<Incident> spec = Specification.where(null);
        
        if (categoryId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("category").get("id"), categoryId));
        }
        if (sectorId != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("sector").get("id"), sectorId));
        }
        if (severity != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("severity"), severity));
        }
        if (status != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("status"), status));
        }
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + keyword.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("description")), "%" + keyword.toLowerCase() + "%")
            ));
        }
        
        return incidentRepository.findAll(spec, pageable);
    }

    public Incident getById(Long id) {
        return incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "id", id));
    }

    public Incident getByReference(String code) {
        return incidentRepository.findByReferenceCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Incident", "referenceCode", code));
    }

    @Transactional
    public Incident createIncident(IncidentRequest request, MultipartFile photo, User reporter) {
        log.info("Creating incident: {}", request.getTitle());
        
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", request.getCategoryId()));
        
        Sector sector = sectorRepository.findById(request.getSectorId())
                .orElseThrow(() -> new ResourceNotFoundException("Sector", "id", request.getSectorId()));
        
        // Save photo if provided
        String photoUrl = null;
        if (photo != null && !photo.isEmpty()) {
            photoUrl = fileStorageService.storeFile(photo);
        }
        
        // AI Analysis
        String base64Image = null;
        if (photo != null && !photo.isEmpty()) {
            try {
                base64Image = Base64.getEncoder().encodeToString(photo.getBytes());
            } catch (Exception e) {
                log.warn("Could not convert image to base64: {}", e.getMessage());
            }
        }
        
        AIAnalysisResponse analysis = aiAnalysisService.analyzeIncident(
                request.getDescription(), base64Image, category.getName());
        
        Incident incident = Incident.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(category)
                .sector(sector)
                .severity(analysis.getSeverity())
                .status(IncidentStatus.OPEN)
                .reportedBy(reporter)
                .photoUrl(photoUrl)
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .aiAnalysisResult(analysis.getRawResponse())
                .authorityNotified(analysis.getAuthorityToAlert())
                .alertSent(false)
                .build();
        
        // Save incident first to get ID for reference code
        Incident savedIncident = incidentRepository.save(incident);
        
        // Update reference code after save
        savedIncident.setReferenceCode(savedIncident.generateReferenceCode());
        savedIncident = incidentRepository.save(savedIncident);
        
        // Create and send alert
        if (analysis.getSeverity() == Severity.HIGH || analysis.getSeverity() == Severity.MEDIUM) {
            alertService.createAndSendAlert(savedIncident);
            savedIncident.setAlertSent(true);
            savedIncident = incidentRepository.save(savedIncident);
        }
        
        log.info("Incident created with reference: {}", savedIncident.getReferenceCode());
        return savedIncident;
    }

    @Transactional
    public Incident updateStatus(Long id, UpdateStatusRequest request) {
        log.info("Updating status for incident: {} to {}", id, request.getStatus());
        Incident incident = getById(id);
        incident.setStatus(request.getStatus());
        
        if (request.getStatus() == IncidentStatus.RESOLVED) {
            incident.setResolvedAt(LocalDateTime.now());
        }
        
        return incidentRepository.save(incident);
    }

    @Transactional
    public void deleteIncident(Long id) {
        log.info("Deleting incident: {}", id);
        Incident incident = getById(id);
        if (incident.getPhotoUrl() != null) {
            fileStorageService.deleteFile(incident.getPhotoUrl());
        }
        incidentRepository.delete(incident);
    }

    public List<Incident> getMyIncidents(User user) {
        return incidentRepository.findByReportedBy(user);
    }

    public List<Incident> getRecentIncidents(int limit) {
        return incidentRepository.findTopNByOrderByCreatedAtDesc(Pageable.ofSize(limit));
    }

    public List<Incident> getBySector(Long sectorId) {
        Sector sector = sectorRepository.findById(sectorId)
                .orElseThrow(() -> new ResourceNotFoundException("Sector", "id", sectorId));
        return incidentRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("sector"), sector));
    }

    public List<Incident> getByCategory(Long categoryId) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        return incidentRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("category"), category));
    }

    public List<IncidentMapDTO> getAllForMap() {
        return incidentRepository.findAll().stream()
                .map(i -> IncidentMapDTO.builder()
                        .id(i.getId())
                        .referenceCode(i.getReferenceCode())
                        .title(i.getTitle())
                        .severity(i.getSeverity())
                        .status(i.getStatus())
                        .latitude(i.getLatitude())
                        .longitude(i.getLongitude())
                        .category(i.getCategory().getName())
                        .build())
                .toList();
    }

    public String generateReferenceCode(Long id) {
        return String.format("INC-%04d", id);
    }
}
