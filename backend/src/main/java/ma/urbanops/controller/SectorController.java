package ma.urbanops.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.urbanops.dto.response.SectorResponse;
import ma.urbanops.entity.Sector;
import ma.urbanops.service.SectorService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sectors")
@RequiredArgsConstructor
@Tag(name = "Sectors", description = "Sector and city management")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowedHeaders = "*")
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
    
    @GetMapping("/city/{city}")
    @Operation(summary = "Get sectors by city")
    public ResponseEntity<List<SectorResponse>> getByCity(@PathVariable String city) {
        List<Sector> sectors = sectorService.findByCity(city);
        return ResponseEntity.ok(sectors.stream().map(this::toResponse).toList());
    }

    private SectorResponse toResponse(Sector s) {
        return SectorResponse.builder()
                .id(s.getId())
                .name(s.getName())
                .city(s.getCity())
                .centerLat(s.getCenterLat())
                .centerLng(s.getCenterLng())
                .build();
    }
}
