package ma.urbanops.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.entity.Category;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.Sector;
import ma.urbanops.entity.User;
import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Role;
import ma.urbanops.enums.Severity;
import ma.urbanops.repository.CategoryRepository;
import ma.urbanops.repository.IncidentRepository;
import ma.urbanops.repository.SectorRepository;
import ma.urbanops.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Arrays;

@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CategoryRepository categoryRepository;
    private final SectorRepository sectorRepository;
    private final UserRepository userRepository;
    private final IncidentRepository incidentRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        log.info("Starting data seeding...");
        
        if (categoryRepository.count() == 0) {
            seedCategories();
        }
        
        if (sectorRepository.count() == 0) {
            seedSectors();
        }
        
        if (userRepository.count() == 0) {
            seedUsers();
        }
        
        if (incidentRepository.count() == 0) {
            seedIncidents();
        }
        
        log.info("Data seeding completed successfully");
    }

    private void seedCategories() {
        log.info("Seeding categories...");
        var categories = Arrays.asList(
            Category.builder().name("Transport").icon("🚌").defaultAuthority("Police Circulation").authorityEmail("police@marrakech.ma").description("Traffic and transportation issues").build(),
            Category.builder().name("Eau").icon("💧").defaultAuthority("RADEEMA").authorityEmail("alerts@radeema.ma").description("Water supply and drainage problems").build(),
            Category.builder().name("Déchets").icon("🗑️").defaultAuthority("Commune").authorityEmail("dechets@marrakech.ma").description("Waste collection and sanitation").build(),
            Category.builder().name("Éclairage").icon("💡").defaultAuthority("Commune").authorityEmail("eclairage@marrakech.ma").description("Street lighting issues").build(),
            Category.builder().name("Électricité").icon("⚡").defaultAuthority("ONEE").authorityEmail("urgence@onee.ma").description("Electrical infrastructure problems").build(),
            Category.builder().name("Voirie").icon("🛣️").defaultAuthority("Commune").authorityEmail("voirie@marrakech.ma").description("Roads and sidewalks maintenance").build(),
            Category.builder().name("Sécurité").icon("🛡️").defaultAuthority("Police").authorityEmail("police@marrakech.ma").description("Security concerns and emergencies").build(),
            Category.builder().name("Espaces verts").icon("🌳").defaultAuthority("Commune").authorityEmail("espacesverts@marrakech.ma").description("Parks and green spaces").build()
        );
        categoryRepository.saveAll(categories);
        log.info("Seeded {} categories", categories.size());
    }

    private void seedSectors() {
        log.info("Seeding sectors...");
        var sectors = Arrays.asList(
            Sector.builder().name("Médina").centerLat(31.6348).centerLng(-7.9920).build(),
            Sector.builder().name("Guéliz").centerLat(31.6350).centerLng(-8.0100).build(),
            Sector.builder().name("Hivernage").centerLat(31.6198).centerLng(-8.0120).build(),
            Sector.builder().name("Mellah").centerLat(31.6282).centerLng(-7.9880).build(),
            Sector.builder().name("Palmeraie").centerLat(31.6550).centerLng(-7.9700).build(),
            Sector.builder().name("M'Hamid").centerLat(31.6100).centerLng(-8.0300).build(),
            Sector.builder().name("Daoudiate").centerLat(31.6405).centerLng(-8.0200).build(),
            Sector.builder().name("SYBA").centerLat(31.6250).centerLng(-8.0050).build()
        );
        sectorRepository.saveAll(sectors);
        log.info("Seeded {} sectors", sectors.size());
    }

    private void seedUsers() {
        log.info("Seeding users...");
        
        User admin = User.builder()
                .firstName("Admin")
                .lastName("UrbanOps")
                .email("admin@urbanops.ma")
                .password(passwordEncoder.encode("Admin@1234"))
                .role(Role.ADMIN)
                .phone("+212612345678")
                .sector("Guéliz")
                .isActive(true)
                .build();
        userRepository.save(admin);
        
        User citizen = User.builder()
                .firstName("Citoyen")
                .lastName("Test")
                .email("citoyen@test.ma")
                .password(passwordEncoder.encode("Test@1234"))
                .role(Role.CITIZEN)
                .phone("+212612345679")
                .sector("Médina")
                .isActive(true)
                .build();
        userRepository.save(citizen);
        
        log.info("Seeded admin and test citizen users");
    }

    private void seedIncidents() {
        log.info("Seeding incidents...");
        
        var categoryTransport = categoryRepository.findByName("Transport").orElseThrow();
        var categoryEau = categoryRepository.findByName("Eau").orElseThrow();
        var categoryDechets = categoryRepository.findByName("Déchets").orElseThrow();
        var categoryEclairage = categoryRepository.findByName("Éclairage").orElseThrow();
        var categoryElectricite = categoryRepository.findByName("Électricité").orElseThrow();
        var categoryVoirie = categoryRepository.findByName("Voirie").orElseThrow();
        var categorySecurite = categoryRepository.findByName("Sécurité").orElseThrow();
        
        var sectorGueliz = sectorRepository.findByName("Guéliz").orElseThrow();
        var sectorMedina = sectorRepository.findByName("Médina").orElseThrow();
        var sectorMellah = sectorRepository.findByName("Mellah").orElseThrow();
        var sectorHivernage = sectorRepository.findByName("Hivernage").orElseThrow();
        var sectorDaoudiate = sectorRepository.findByName("Daoudiate").orElseThrow();
        var sectorPalmeraie = sectorRepository.findByName("Palmeraie").orElseThrow();
        
        var incidents = Arrays.asList(
            Incident.builder().title("Embouteillage Av. Mohammed VI").description("Trafic bloqué depuis 2h, aucune alternative").category(categoryTransport).sector(sectorGueliz).severity(Severity.HIGH).status(IncidentStatus.OPEN).latitude(31.6347).longitude(-8.0083).build(),
            Incident.builder().title("Fuite d'eau rue Bab Doukkala").description("Fuite importante, chaussée inondée").category(categoryEau).sector(sectorMedina).severity(Severity.HIGH).status(IncidentStatus.IN_PROGRESS).latitude(31.6330).longitude(-7.9990).build(),
            Incident.builder().title("Poubelles non collectées Mellah").description("3 jours sans collecte, odeurs").category(categoryDechets).sector(sectorMellah).severity(Severity.MEDIUM).status(IncidentStatus.OPEN).latitude(31.6282).longitude(-7.9880).build(),
            Incident.builder().title("Lampadaires hors service Hivernage").description("12 lampadaires éteints sur 300m").category(categoryEclairage).sector(sectorHivernage).severity(Severity.MEDIUM).status(IncidentStatus.IN_PROGRESS).latitude(31.6198).longitude(-8.0120).build(),
            Incident.builder().title("Câble électrique exposé Daoudiate").description("Câble HT tombé sur le trottoir, danger immédiat").category(categoryElectricite).sector(sectorDaoudiate).severity(Severity.HIGH).status(IncidentStatus.OPEN).latitude(31.6405).longitude(-8.0200).build(),
            Incident.builder().title("Nid de poule Av. Hassan II").description("Trou profond, risque pneu").category(categoryVoirie).sector(sectorGueliz).severity(Severity.MEDIUM).status(IncidentStatus.RESOLVED).resolvedAt(LocalDateTime.now().minusHours(3)).latitude(31.6290).longitude(-8.0060).build(),
            Incident.builder().title("Inondation parking souterrain Guéliz").description("Eau s'accumule, parking inaccessible").category(categoryEau).sector(sectorGueliz).severity(Severity.HIGH).status(IncidentStatus.IN_PROGRESS).latitude(31.6310).longitude(-8.0140).build(),
            Incident.builder().title("Bac à ordures débordant Palmeraie").description("Bac plein depuis 2 jours").category(categoryDechets).sector(sectorPalmeraie).severity(Severity.LOW).status(IncidentStatus.RESOLVED).resolvedAt(LocalDateTime.now().minusHours(4)).latitude(31.6550).longitude(-7.9700).build(),
            Incident.builder().title("Signalisation dégradée Rte Casablanca").description("Panneau STOP tombé à l'intersection").category(categoryTransport).sector(sectorGueliz).severity(Severity.MEDIUM).status(IncidentStatus.OPEN).latitude(31.6100).longitude(-8.0300).build(),
            Incident.builder().title("Vol de câbles électriques").description("Câbles volés dans le quartier, zone sans électricité").category(categorySecurite).sector(sectorMedina).severity(Severity.HIGH).status(IncidentStatus.OPEN).latitude(31.6300).longitude(-7.9950).build()
        );
        
        incidentRepository.saveAll(incidents);
        
        // Update reference codes
        for (Incident incident : incidents) {
            incident.setReferenceCode(incident.generateReferenceCode());
        }
        incidentRepository.saveAll(incidents);
        
        log.info("Seeded {} incidents", incidents.size());
    }
}
