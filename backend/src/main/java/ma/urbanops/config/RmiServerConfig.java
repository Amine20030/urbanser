package ma.urbanops.config;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.rmi.AIAnalysisRemoteImpl;
import ma.urbanops.service.AIAnalysisService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;

import java.rmi.registry.LocateRegistry;
import java.rmi.registry.Registry;

@Configuration
@Slf4j
public class RmiServerConfig {

    private final AIAnalysisService aiAnalysisService;

    @Value("${rmi.port:1099}")
    private int rmiPort;

    public RmiServerConfig(AIAnalysisService aiAnalysisService) {
        this.aiAnalysisService = aiAnalysisService;
    }

    @PostConstruct
    public void registerRmiService() {
        try {
            AIAnalysisRemoteImpl remoteService = new AIAnalysisRemoteImpl(aiAnalysisService);

            Registry registry;
            try {
                registry = LocateRegistry.createRegistry(rmiPort);
                log.info("[RMI] Registry created on port {}", rmiPort);
            } catch (Exception e) {
                registry = LocateRegistry.getRegistry(rmiPort);
                log.info("[RMI] Using existing registry on port {} ({})", rmiPort, e.getMessage());
            }

            registry.rebind("AIAnalysisService", remoteService);
            log.info("[RMI] AIAnalysisService bound — rmi://localhost:{}/AIAnalysisService", rmiPort);
        } catch (Exception e) {
            log.error("[RMI] Failed to start RMI server: {}", e.getMessage());
        }
    }
}
