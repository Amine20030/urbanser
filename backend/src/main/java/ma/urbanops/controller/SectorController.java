package ma.urbanops.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.urbanops.dto.response.IncidentResponse;
import ma.urbanops.dto.response.SectorResponse;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.Sector;
import ma.urbanops.service.SectorService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sectors")
@RequiredArgsConstructor
@Tag(name = "Sectors", description = "City sector management")
public class SectorController {

    private final SectorService sectorService;

    @GetMapping
    @Operation(summary = "Get all sectors")
    public ResponseEntity<List<SectorResponse>> getAllSectors() {
        List<Sector> sectors = sectorService.findAllActive();
        return ResponseEntity.ok(sectors.stream().map(this::toResponse).toList());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get sector by ID")
    public ResponseEntity<SectorResponse> getSectorById(@PathVariable Long id) {
        Sector sector = sectorService.findById(id);
        return ResponseEntity.ok(toResponse(sector));
    }

    @GetMapping("/{id}/incidents")
    @Operation(summary = "Get incidents in a sector")
    public ResponseEntity<List<IncidentResponse>> getSectorIncidents(@PathVariable Long id) {
        List<Incident> incidents = sectorService.getIncidentsBySector(id);
        return ResponseEntity.ok(incidents.stream().map(this::toIncidentResponse).toList());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Create new sector")
    @SecurityRequirement(name = "bearerAuth")
    public ResponseEntity<SectorResponse> createSector(@RequestBody Sector sector) {
        Sector saved = sectorService.create(sector);
        return ResponseEntity.ok(toResponse(saved));
    }

    private SectorResponse toResponse(Sector s) {
        return SectorResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .city(s.getCity())
                .centerLat(s.getCenterLat())
                .centerLng(s.getCenterLng())
                .description(s.getDescription())
                .build();
    }

    private IncidentResponse toIncidentResponse(Incident i) {
        return IncidentResponse.builder()
                .id(i.getId())
                .referenceCode(i.getReferenceCode())
                .title(i.getTitle())
                .severity(i.getSeverity())
                .status(i.getStatus())
                .build();
    }
}
