package ma.urbanops.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.Sector;
import ma.urbanops.exception.ResourceNotFoundException;
import ma.urbanops.repository.IncidentRepository;
import ma.urbanops.repository.SectorRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SectorService {

    private final SectorRepository sectorRepository;
    private final IncidentRepository incidentRepository;

    public List<Sector> findAllActive() {
        return sectorRepository.findAllActiveOrderByName();
    }

    public Sector findById(Long id) {
        return sectorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Sector", "id", id));
    }

    public List<Incident> getIncidentsBySector(Long sectorId) {
        Sector sector = findById(sectorId);
        return incidentRepository.findAll((root, query, cb) -> 
            cb.equal(root.get("sector"), sector));
    }

    @Transactional
    public Sector create(Sector sector) {
        if (sectorRepository.existsByName(sector.getName())) {
            throw new IllegalArgumentException("Sector already exists: " + sector.getName());
        }
        return sectorRepository.save(sector);
    }
}
