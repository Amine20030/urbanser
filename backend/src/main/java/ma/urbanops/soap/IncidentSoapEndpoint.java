package ma.urbanops.soap;

import jakarta.xml.bind.annotation.XmlAccessType;
import jakarta.xml.bind.annotation.XmlAccessorType;
import jakarta.xml.bind.annotation.XmlRootElement;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.dto.response.StatsResponse;
import ma.urbanops.entity.Incident;
import ma.urbanops.repository.IncidentRepository;
import ma.urbanops.service.StatsService;
import org.springframework.ws.server.endpoint.annotation.Endpoint;
import org.springframework.ws.server.endpoint.annotation.PayloadRoot;
import org.springframework.ws.server.endpoint.annotation.RequestPayload;
import org.springframework.ws.server.endpoint.annotation.ResponsePayload;

import java.time.LocalDateTime;
import java.util.Optional;

@Endpoint
@Slf4j
@RequiredArgsConstructor
public class IncidentSoapEndpoint {

    private static final String NAMESPACE = "http://urbanops.ma/soap";

    private final IncidentRepository incidentRepository;
    private final StatsService statsService;

    @PayloadRoot(namespace = NAMESPACE, localPart = "getIncidentStatsRequest")
    @ResponsePayload
    public GetIncidentStatsResponse getIncidentStats(
            @RequestPayload GetIncidentStatsRequest request) {

        log.info("[SOAP] getIncidentStats — sector={}, category={}",
                request.getSector(), request.getCategory());

        StatsResponse stats = statsService.getDashboardStats();

        GetIncidentStatsResponse response = new GetIncidentStatsResponse();
        response.setTotalIncidents(stats.getTotalIncidents());
        response.setOpenIncidents(stats.getOpenIncidents());
        response.setResolvedIncidents(stats.getResolvedIncidents());
        response.setHighSeverityCount(stats.getHighSeverityCount());
        response.setResolutionRate(stats.getResolutionRate());
        response.setGeneratedAt(LocalDateTime.now().toString());

        return response;
    }

    @PayloadRoot(namespace = NAMESPACE, localPart = "getIncidentByReferenceRequest")
    @ResponsePayload
    public GetIncidentByReferenceResponse getIncidentByReference(
            @RequestPayload GetIncidentByReferenceRequest request) {

        log.info("[SOAP] getIncidentByReference — ref={}", request.getReferenceCode());

        GetIncidentByReferenceResponse response = new GetIncidentByReferenceResponse();

        Optional<Incident> opt = incidentRepository.findByReferenceCode(request.getReferenceCode());

        if (opt.isPresent()) {
            Incident i = opt.get();
            response.setFound(true);
            response.setId(i.getId());
            response.setReferenceCode(i.getReferenceCode());
            response.setTitle(i.getTitle());
            response.setSeverity(i.getSeverity() != null ? i.getSeverity().name() : "");
            response.setStatus(i.getStatus() != null ? i.getStatus().name() : "");
            response.setCategory(i.getCategory() != null ? i.getCategory().getName() : "");
            response.setSector(i.getSector() != null ? i.getSector().getName() : "");
            response.setAuthorityNotified(i.getAuthorityNotified() != null
                    ? i.getAuthorityNotified() : "");
            response.setCreatedAt(i.getCreatedAt() != null
                    ? i.getCreatedAt().toString() : "");
        } else {
            response.setFound(false);
            response.setReferenceCode(request.getReferenceCode());
            response.setTitle("Incident not found");
        }

        return response;
    }

    @XmlRootElement(namespace = NAMESPACE, name = "getIncidentStatsRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class GetIncidentStatsRequest {
        private String sector;
        private String category;

        public String getSector() {
            return sector;
        }

        public void setSector(String sector) {
            this.sector = sector;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }
    }

    @XmlRootElement(namespace = NAMESPACE, name = "getIncidentStatsResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class GetIncidentStatsResponse {
        private long totalIncidents;
        private long openIncidents;
        private long resolvedIncidents;
        private long highSeverityCount;
        private double resolutionRate;
        private String generatedAt;

        public long getTotalIncidents() {
            return totalIncidents;
        }

        public void setTotalIncidents(long totalIncidents) {
            this.totalIncidents = totalIncidents;
        }

        public long getOpenIncidents() {
            return openIncidents;
        }

        public void setOpenIncidents(long openIncidents) {
            this.openIncidents = openIncidents;
        }

        public long getResolvedIncidents() {
            return resolvedIncidents;
        }

        public void setResolvedIncidents(long resolvedIncidents) {
            this.resolvedIncidents = resolvedIncidents;
        }

        public long getHighSeverityCount() {
            return highSeverityCount;
        }

        public void setHighSeverityCount(long highSeverityCount) {
            this.highSeverityCount = highSeverityCount;
        }

        public double getResolutionRate() {
            return resolutionRate;
        }

        public void setResolutionRate(double resolutionRate) {
            this.resolutionRate = resolutionRate;
        }

        public String getGeneratedAt() {
            return generatedAt;
        }

        public void setGeneratedAt(String generatedAt) {
            this.generatedAt = generatedAt;
        }
    }

    @XmlRootElement(namespace = NAMESPACE, name = "getIncidentByReferenceRequest")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class GetIncidentByReferenceRequest {
        private String referenceCode;

        public String getReferenceCode() {
            return referenceCode;
        }

        public void setReferenceCode(String referenceCode) {
            this.referenceCode = referenceCode;
        }
    }

    @XmlRootElement(namespace = NAMESPACE, name = "getIncidentByReferenceResponse")
    @XmlAccessorType(XmlAccessType.FIELD)
    public static class GetIncidentByReferenceResponse {
        private long id;
        private String referenceCode;
        private String title;
        private String severity;
        private String status;
        private String category;
        private String sector;
        private String authorityNotified;
        private String createdAt;
        private boolean found;

        public long getId() {
            return id;
        }

        public void setId(long id) {
            this.id = id;
        }

        public String getReferenceCode() {
            return referenceCode;
        }

        public void setReferenceCode(String referenceCode) {
            this.referenceCode = referenceCode;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getSeverity() {
            return severity;
        }

        public void setSeverity(String severity) {
            this.severity = severity;
        }

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public String getSector() {
            return sector;
        }

        public void setSector(String sector) {
            this.sector = sector;
        }

        public String getAuthorityNotified() {
            return authorityNotified;
        }

        public void setAuthorityNotified(String authorityNotified) {
            this.authorityNotified = authorityNotified;
        }

        public String getCreatedAt() {
            return createdAt;
        }

        public void setCreatedAt(String createdAt) {
            this.createdAt = createdAt;
        }

        public boolean isFound() {
            return found;
        }

        public void setFound(boolean found) {
            this.found = found;
        }
    }
}
