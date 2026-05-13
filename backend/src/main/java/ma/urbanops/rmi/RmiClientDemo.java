package ma.urbanops.rmi;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

/**
 * Standalone RMI client — run after Spring Boot is up:
 * {@code java -cp target/classes ma.urbanops.rmi.RmiClientDemo}
 */
public class RmiClientDemo {
    public static void main(String[] args) throws Exception {
        System.out.println("=== UrbanOps RMI Client Demo ===");

        Registry registry = LocateRegistry.getRegistry("localhost", 1099);
        AIAnalysisRemote aiService = (AIAnalysisRemote) registry.lookup("AIAnalysisService");

        System.out.println("Ping: " + aiService.ping());

        String result1 = aiService.classifyIncident(
                "câble électrique exposé sur le trottoir", "Électricité");
        System.out.println("Classification 1: " + result1);

        String result2 = aiService.classifyIncident(
                "embouteillage avenue Mohammed VI", "Transport");
        System.out.println("Classification 2: " + result2);

        String severity = aiService.getSeverity("fuite de gaz importante");
        System.out.println("Severity: " + severity);

        System.out.println("=== RMI Demo Complete ===");
    }
}
