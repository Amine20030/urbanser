package ma.urbanops.rmi;

import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.response.AIAnalysisResult;
import ma.urbanops.service.AIAnalysisService;

import java.rmi.RemoteException;
import java.rmi.server.UnicastRemoteObject;
import java.util.LinkedHashMap;
import java.util.Map;

@Slf4j
public class AIAnalysisRemoteImpl extends UnicastRemoteObject implements AIAnalysisRemote {

    private static final ObjectMapper JSON = new ObjectMapper();

    private final transient AIAnalysisService aiAnalysisService;

    public AIAnalysisRemoteImpl(AIAnalysisService aiAnalysisService) throws RemoteException {
        super();
        this.aiAnalysisService = aiAnalysisService;
    }

    @Override
    public String classifyIncident(String description, String categoryHint) throws RemoteException {
        log.info("[RMI] classifyIncident called");
        try {
            AIAnalysisResult result = aiAnalysisService.analyze(description, categoryHint);
            return toJson(result, Boolean.TRUE.equals(result.getFallbackUsed()));
        } catch (Exception e) {
            log.error("[RMI] classifyIncident error: {}", e.getMessage());
            AIAnalysisResult fallback = aiAnalysisService.fallback(description, categoryHint);
            return toJson(fallback, true);
        }
    }

    @Override
    public String getSeverity(String description) throws RemoteException {
        log.info("[RMI] getSeverity called");
        try {
            AIAnalysisResult result = aiAnalysisService.analyze(description, null);
            return result.getSeverity();
        } catch (Exception e) {
            return "MEDIUM";
        }
    }

    @Override
    public String ping() throws RemoteException {
        return "OK — UrbanOps RMI AI Service running";
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        return super.equals(obj);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    private String toJson(AIAnalysisResult r, boolean fallback) throws RemoteException {
        try {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("category", r.getCategory());
            m.put("severity", r.getSeverity());
            m.put("authority", r.getAuthorityName());
            m.put("confidence", r.getConfidence() != null ? r.getConfidence() : 0.0);
            m.put("fallback", fallback);
            return JSON.writeValueAsString(m);
        } catch (Exception e) {
            throw new RemoteException("JSON encoding failed", e);
        }
    }
}
