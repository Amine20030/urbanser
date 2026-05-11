package ma.urbanops;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * UrbanOps Spring Boot Application.
 *
 * Features enabled:
 * - @EnableAsync: Asynchronous method execution for non-blocking email sending
 * - @EnableScheduling: Scheduled tasks for background processing
 *
 * @author UrbanOps Team
 * @version 1.0.0
 */
@SpringBootApplication
@EnableAsync    // FIX 4: Enable asynchronous processing for @Async methods
@EnableScheduling  // FIX 11: Enable scheduled tasks for @Scheduled methods
public class UrbanOpsApplication {
    public static void main(String[] args) {
        SpringApplication.run(UrbanOpsApplication.class, args);
    }
}
