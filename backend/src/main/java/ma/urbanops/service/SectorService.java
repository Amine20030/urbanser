package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.response.SectorResponse;
import ma.urbanops.entity.Sector;
import ma.urbanops.entity.Incident;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.SectorRepository;
import ma.urbanops.repository.IncidentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service @Slf4j @RequiredArgsConstructor @Transactional
public class SectorService {
    private final SectorRepository sectorRepository;
    private final IncidentRepository incidentRepository;

    @Transactional(readOnly=true)
    public List<Sector> findAll() { return sectorRepository.findAll(); }

    @Transactional(readOnly=true)
    public Sector findById(Long id) {
        return sectorRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Sector","id",id));
    }

    @Transactional(readOnly=true)
    public List<Sector> findAllActive() { return sectorRepository.findAll(); }

    @Transactional(readOnly=true)
    public List<Sector> findByCity(String city) { return sectorRepository.findByCity(city); }

    public Sector create(Sector s) { return sectorRepository.save(s); }

    public List<Incident> getIncidentsBySector(Long sectorId) {
        Sector sector = sectorRepository.findById(sectorId)
            .orElseThrow(() -> new ResourceNotFoundException("Sector","id",sectorId));
        return incidentRepository.findAll((root, query, cb) -> cb.equal(root.get("sector"), sector));
    }

    public SectorResponse toResponse(Sector s) {
        return SectorResponse.builder()
            .id(s.getId()).name(s.getName()).city(s.getCity())
            .centerLat(s.getCenterLat()).centerLng(s.getCenterLng())
            .build();
    }
}
