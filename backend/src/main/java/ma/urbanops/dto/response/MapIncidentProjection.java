package ma.urbanops.dto.response;

import ma.urbanops.enums.IncidentStatus;
import ma.urbanops.enums.Severity;

/**
 * JPA Interface-Based Projection — Spring Data JPA loads ONLY these fields from DB.
 * No entity hydration, no unnecessary columns fetched.
 * This is a core Spring Data JPA concept for performance optimization.
 *
 * Used by the /api/v1/incidents/map endpoint to return lightweight incident data
 * for map display without loading full Incident entities.
 *
 * @author UrbanOps Team
 * @version 1.0.0
 */
public interface MapIncidentProjection {

    Long getId();

    String getReferenceCode();

    String getTitle();

    Double getLatitude();

    Double getLongitude();

    // Returns as String to avoid enum serialization issues in projections
    Severity getSeverity();

    IncidentStatus getStatus();

    // Nested projection for category name only
    String getCategoryName();
}
