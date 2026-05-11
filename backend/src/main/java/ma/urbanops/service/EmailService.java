package ma.urbanops.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import ma.urbanops.entity.Incident;
import ma.urbanops.entity.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.concurrent.CompletableFuture;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    /**
     * Sends alert email asynchronously — does NOT block the API response.
     * If SMTP is slow (30s timeout), the incident creation API returns immediately.
     *
     * @Async runs this in a separate thread pool (see AsyncConfig).
     *
     * @param toEmail recipient email
     * @param authorityName authority name
     * @param incident the incident to alert about
     * @return CompletableFuture for async completion tracking
     */
    @Async  // FIX 4: Non-blocking async execution
    public CompletableFuture<Void> sendAlertEmail(String toEmail, String authorityName, Incident incident) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject("[URGENT] Alert: " + incident.getSeverity() + " - " + incident.getTitle());
            String content = buildAlertEmailContent(authorityName, incident);
            helper.setText(content, true);
            mailSender.send(message);
            log.info("Alert email sent to: {} for incident {}", toEmail, incident.getReferenceCode());
        } catch (MessagingException e) {
            log.error("Failed to send alert email: {}", e.getMessage());
            // FIX 4: Do NOT rethrow — async failure must not break the API response
        }
        return CompletableFuture.completedFuture(null);
    }

    /**
     * Sends confirmation email asynchronously to the incident reporter.
     *
     * @Async ensures this runs in a separate thread and doesn't delay the API response.
     *
     * @param user the user who reported the incident
     * @param incident the reported incident
     * @return CompletableFuture for async completion tracking
     */
    @Async  // FIX 4: Non-blocking async execution
    public CompletableFuture<Void> sendConfirmationToReporter(User user, Incident incident) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(user.getEmail());
            message.setSubject("Confirmation: Incident Reported - " + incident.getReferenceCode());
            message.setText("Dear " + user.getFirstName() + ",\n\nYour incident has been reported successfully.\nReference: " + incident.getReferenceCode() + "\nStatus: " + incident.getStatus() + "\n\nThank you for helping improve Marrakech!");
            mailSender.send(message);
            log.info("Confirmation email sent to: {}", user.getEmail());
        } catch (Exception e) {
            log.error("Failed to send confirmation email: {}", e.getMessage());
            // FIX 4: Do NOT rethrow — async failure must not break the API response
        }
        return CompletableFuture.completedFuture(null);
    }

    private String buildAlertEmailContent(String authorityName, Incident incident) {
        String mapLink = "https://www.google.com/maps?q=" + incident.getLatitude() + "," + incident.getLongitude();
        return "<html><body><h2>UrbanOps Alert - " + incident.getSeverity() + "</h2><p><strong>Incident:</strong> " + incident.getTitle() + "</p><p><strong>Reference:</strong> " + incident.getReferenceCode() + "</p><p><strong>Description:</strong> " + incident.getDescription() + "</p><p><strong>Location:</strong> <a href='" + mapLink + "'>View on Map</a></p></body></html>";
    }
}
