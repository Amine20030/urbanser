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
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendAlertEmail(String toEmail, String authorityName, Incident incident) {
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
        }
    }

    public void sendConfirmationToReporter(User user, Incident incident) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(user.getEmail());
        message.setSubject("Confirmation: Incident Reported - " + incident.getReferenceCode());
        message.setText("Dear " + user.getFirstName() + ",\n\nYour incident has been reported successfully.\nReference: " + incident.getReferenceCode() + "\nStatus: " + incident.getStatus() + "\n\nThank you for helping improve Marrakech!");
        mailSender.send(message);
        log.info("Confirmation email sent to: {}", user.getEmail());
    }

    private String buildAlertEmailContent(String authorityName, Incident incident) {
        String mapLink = "https://www.google.com/maps?q=" + incident.getLatitude() + "," + incident.getLongitude();
        return "<html><body><h2>UrbanOps Alert - " + incident.getSeverity() + "</h2><p><strong>Incident:</strong> " + incident.getTitle() + "</p><p><strong>Reference:</strong> " + incident.getReferenceCode() + "</p><p><strong>Description:</strong> " + incident.getDescription() + "</p><p><strong>Location:</strong> <a href='" + mapLink + "'>View on Map</a></p></body></html>";
    }
}
