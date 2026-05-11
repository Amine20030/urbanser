package ma.urbanops.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.AsyncConfigurer;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

/**
 * Configuration for asynchronous method execution (@Async).
 *
 * This configuration ensures that:
 * 1. Email sending runs in a separate thread pool — API responses are never blocked
 * 2. Scheduled tasks have their own thread pool
 * 3. Thread names are prefixed for easy log identification
 *
 * Thread pool sizing: 2-10 threads, queue capacity 50
 * This handles burst traffic without overwhelming the SMTP server.
 *
 * @author UrbanOps Team
 * @version 1.0.0
 * @see org.springframework.scheduling.annotation.Async
 */
@Configuration
@EnableAsync
public class AsyncConfig implements AsyncConfigurer {

    /**
     * Configures the async executor for @Async methods.
     * Used by EmailService for non-blocking email sending.
     *
     * @return Executor with custom thread pool settings
     */
    @Override
    public Executor getAsyncExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(2);       // Minimum 2 threads always ready
        executor.setMaxPoolSize(10);       // Maximum 10 threads under load
        executor.setQueueCapacity(50);     // Queue up to 50 tasks before rejecting
        executor.setThreadNamePrefix("EmailAsync-");  // Easy log identification
        executor.initialize();
        return executor;
    }
}
