package ma.urbanops.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import ma.urbanops.dto.response.StatsResponse;
import ma.urbanops.service.StatsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stats")
@RequiredArgsConstructor
@Tag(name = "Statistics", description = "Dashboard statistics endpoints")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"}, allowedHeaders = "*")
public class StatsController {

    private final StatsService statsService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get full dashboard statistics")
    public ResponseEntity<StatsResponse> getDashboardStats() {
        return ResponseEntity.ok(statsService.getDashboardStats());
    }

    @GetMapping("/incidents/by-category")
    @Operation(summary = "Get incident count by category")
    public ResponseEntity<List<StatsResponse.CategoryCount>> getStatsByCategory() {
        return ResponseEntity.ok(statsService.getStatsByCategory());
    }

    @GetMapping("/incidents/by-sector")
    @Operation(summary = "Get incident count by sector")
    public ResponseEntity<List<StatsResponse.SectorCount>> getStatsBySector() {
        return ResponseEntity.ok(statsService.getStatsBySector());
    }

    @GetMapping("/incidents/hourly")
    @Operation(summary = "Get hourly incident statistics")
    public ResponseEntity<List<Map<String,Object>>> getHourlyStats() {
        return ResponseEntity.ok(statsService.getHourlyStats());
    }

    @GetMapping("/services/health")
    @Operation(summary = "Get service health percentages")
    public ResponseEntity<List<StatsResponse.ServiceHealth>> getServicesHealth() {
        return ResponseEntity.ok(statsService.getServicesHealth());
    }

    @GetMapping("/resolution-rate")
    @Operation(summary = "Get overall resolution rate")
    public ResponseEntity<Map<String, Double>> getResolutionRate() {
        return ResponseEntity.ok(Map.of("rate", statsService.getResolutionRate()));
    }

    @GetMapping("/jms/status")
    @Operation(summary = "JMS queue status")
    public ResponseEntity<Map<String, Object>> getJmsStatus() {
        return ResponseEntity.ok(Map.of(
                "broker", "ActiveMQ Artemis (embedded)",
                "queue", "urbanops.alert.queue",
                "status", "active",
                "description", "Asynchronous alert queue — incidents trigger JMS messages consumed by email service"
        ));
    }

    @GetMapping("/rmi/status")
    @Operation(summary = "RMI service status")
    public ResponseEntity<Map<String, Object>> getRmiStatus() {
        return ResponseEntity.ok(Map.of(
                "service", "AIAnalysisService",
                "protocol", "RMI (Java Remote Method Invocation)",
                "url", "rmi://localhost:1099/AIAnalysisService",
                "methods", List.of(
                        "classifyIncident(description, categoryHint)",
                        "getSeverity(description)",
                        "ping()"),
                "description", "Remote AI classification service — callable from any JVM"
        ));
    }
}
