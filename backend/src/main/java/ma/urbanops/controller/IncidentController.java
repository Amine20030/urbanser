package ma.urbanops.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import jakarta.validation.Valid;
import ma.urbanops.dto.request.IncidentRequest;
import ma.urbanops.dto.request.UpdateStatusRequest;
import ma.urbanops.dto.response.IncidentResponse;
import ma.urbanops.dto.response.UserResponse;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.User;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Severity;
import ma.urbanops.security.UserDetailsImpl;
import ma.urbanops.service.IncidentService;
import ma.urbanops.service.UserService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/incidents")
@RequiredArgsConstructor
@Tag(name = "Incidents", description = "Incident management endpoints")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowedHeaders = "*")
public class IncidentController {

    private final IncidentService incidentService;
    private final UserService userService;

    @GetMapping
    @Operation(summary = "Get all incidents with filters")
    public ResponseEntity<Page<IncidentResponse>> getAllIncidents(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long sectorId,
            @RequestParam(required = false) Severity severity,
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) String keyword,
            Pageable pageable) {
        Page<Incident> incidents = incidentService.getAllIncidents(categoryId, sectorId, severity, status, keyword, pageable);
        return ResponseEntity.ok(incidents.map(this::toResponse));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get incident by ID")
    public ResponseEntity<IncidentResponse> getIncidentById(@PathVariable Long id) {
        Incident incident = incidentService.getById(id);
        return ResponseEntity.ok(toResponse(incident));
    }

    @GetMapping("/reference/{code}")
    @Operation(summary = "Get incident by reference code")
    public ResponseEntity<IncidentResponse> getIncidentByReference(@PathVariable String code) {
        Incident incident = incidentService.getByReference(code);
        return ResponseEntity.ok(toResponse(incident));
    }

    @PostMapping(consumes = "multipart/form-data")
    @Operation(summary = "Create a new incident")
    public ResponseEntity<IncidentResponse> createIncident(
            @RequestPart("data") IncidentRequest request,
            @RequestPart(value = "photo", required = false) MultipartFile photo,
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User reporter = userDetails != null ? userService.findByEmail(userDetails.getUsername()) : null;
        Incident incident = incidentService.createIncident(request, photo, reporter);
        IncidentResponse response = toResponse(incident);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header("Location", "/api/v1/incidents/" + incident.getId())
                .body(response);
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER')")
    @Operation(summary = "Update incident status")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<IncidentResponse> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody UpdateStatusRequest request) {
        Incident incident = incidentService.updateStatus(id, request);
        return ResponseEntity.ok(toResponse(incident));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Delete incident")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<Void> deleteIncident(@PathVariable Long id) {
        incidentService.deleteIncident(id);
        return ResponseEntity.noContent().build();  // HTTP 204 No Content
    }

    @GetMapping("/my")
    @Operation(summary = "Get incidents reported by current user")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<List<IncidentResponse>> getMyIncidents(
            @AuthenticationPrincipal UserDetailsImpl userDetails) {
        User user = userService.findByEmail(userDetails.getUsername());
        List<Incident> incidents = incidentService.getMyIncidents(user);
        return ResponseEntity.ok(incidents.stream().map(this::toResponse).toList());
    }

    @GetMapping("/map")
    @Operation(summary = "Get all incidents for map display")
    public ResponseEntity<List<java.util.Map<String,Object>>> getForMap() {
        List<Incident> incidents = incidentService.getAllForMap();
        List<java.util.Map<String,Object>> result = incidents.stream().map(i -> {
            java.util.Map<String,Object> m = new java.util.LinkedHashMap<>();
            m.put("id", i.getId());
            m.put("title", i.getTitle());
            m.put("latitude", i.getLatitude());
            m.put("longitude", i.getLongitude());
            m.put("severity", i.getSeverity() != null ? i.getSeverity().name() : "MEDIUM");
            m.put("status", i.getStatus() != null ? i.getStatus().name() : "OPEN");
            m.put("authorityNotified", i.getAuthorityNotified());
            java.util.Map<String, String> catInfo = new java.util.LinkedHashMap<>();
            if (i.getCategory() != null) {
                catInfo.put("name", i.getCategory().getName());
                catInfo.put("icon", i.getCategory().getIcon() != null ? i.getCategory().getIcon() : "📍");
            } else {
                catInfo.put("name", "Autre");
                catInfo.put("icon", "📍");
            }
            m.put("category", catInfo);
            return m;
        }).toList();
        return ResponseEntity.ok(result);
    }

    @GetMapping("/recent")
    @Operation(summary = "Get 10 most recent incidents")
    public ResponseEntity<List<IncidentResponse>> getRecentIncidents() {
        List<Incident> incidents = incidentService.getRecentIncidents(10);
        return ResponseEntity.ok(incidents.stream().map(this::toResponse).toList());
    }

    @GetMapping("/sector/{sectorId}")
    @Operation(summary = "Get incidents by sector")
    public ResponseEntity<List<IncidentResponse>> getBySector(@PathVariable Long sectorId) {
        List<Incident> incidents = incidentService.getBySector(sectorId);
        return ResponseEntity.ok(incidents.stream().map(this::toResponse).toList());
    }

    @GetMapping("/category/{categoryId}")
    @Operation(summary = "Get incidents by category")
    public ResponseEntity<List<IncidentResponse>> getByCategory(@PathVariable Long categoryId) {
        List<Incident> incidents = incidentService.getByCategory(categoryId);
        return ResponseEntity.ok(incidents.stream().map(this::toResponse).toList());
    }

    private IncidentResponse toResponse(Incident i) {
        return IncidentResponse.builder()
                .id(i.getId())
                .referenceCode(i.getReferenceCode())
                .title(i.getTitle())
                .description(i.getDescription())
                .category(i.getCategory() != null ? ma.urbanops.dto.response.CategoryResponse.builder()
                        .id(i.getCategory().getId())
                        .name(i.getCategory().getName())
                        .icon(i.getCategory().getIcon())
                        .defaultAuthority(i.getCategory().getDefaultAuthority())
                        .authorityEmail(i.getCategory().getAuthorityEmail())
                        .build() : null)
                .sector(i.getSector() != null ? ma.urbanops.dto.response.SectorResponse.builder()
                        .id(i.getSector().getId())
                        .name(i.getSector().getName())
                        .city(i.getSector().getCity())
                        .centerLat(i.getSector().getCenterLat())
                        .centerLng(i.getSector().getCenterLng())
                        .build() : null)
                .severity(i.getSeverity() != null ? i.getSeverity().name() : null)
                .status(i.getStatus() != null ? i.getStatus().name() : null)
                .reportedBy(i.getReportedBy() != null ? UserResponse.builder()
                        .id(i.getReportedBy().getId())
                        .firstName(i.getReportedBy().getFirstName())
                        .lastName(i.getReportedBy().getLastName())
                        .email(i.getReportedBy().getEmail())
                        .phone(i.getReportedBy().getPhone())
                        .role(i.getReportedBy().getRole())
                        .sector(i.getReportedBy().getSector())
                        .receiveAlerts(i.getReportedBy().getReceiveAlerts())
                        .isActive(i.getReportedBy().getIsActive())
                        .createdAt(i.getReportedBy().getCreatedAt())
                        .build() : null)
                .photoUrl(i.getPhotoUrl())
                .latitude(i.getLatitude())
                .longitude(i.getLongitude())
                .authorityNotified(i.getAuthorityNotified())
                .aiAnalysisResult(i.getAiAnalysisResult())
                .alertSent(i.getAlertSent())
                .createdAt(i.getCreatedAt())
                .updatedAt(i.getUpdatedAt())
                .resolvedAt(i.getResolvedAt())
                .build();
    }
}
