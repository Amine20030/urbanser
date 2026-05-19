package ma.urbanops.rmi;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

import lombok.extern.slf4j.Slf4j;

/**
 * Standalone RMI client — run after Spring Boot is up:
 * {@code java -cp target/classes ma.urbanops.rmi.RmiClientDemo}
 */
@Slf4j
public class RmiClientDemo {
    public static void main(String[] args) throws Exception {
        log.info("=== UrbanOps RMI Client Demo ===");

        Registry registry = LocateRegistry.getRegistry("localhost", 1099);
        AIAnalysisRemote aiService = (AIAnalysisRemote) registry.lookup("AIAnalysisService");

        log.info("Ping: {}", aiService.ping());

        String result1 = aiService.classifyIncident(
                "câble électrique exposé sur le trottoir", "Électricité");
        log.info("Classification 1: {}", result1);

        String result2 = aiService.classifyIncident(
                "embouteillage avenue Mohammed VI", "Transport");
        log.info("Classification 2: {}", result2);

        String severity = aiService.getSeverity("fuite de gaz importante");
        log.info("Severity: {}", severity);

        log.info("=== RMI Demo Complete ===");
    }
}
