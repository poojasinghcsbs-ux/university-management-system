package com.rgpv.universityportal.config;

import com.rgpv.universityportal.model.AdminUser;
import com.rgpv.universityportal.repository.AdminUserRepository;
import java.time.LocalDateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminDataInitializer implements CommandLineRunner {

    private static final Logger LOGGER = LoggerFactory.getLogger(AdminDataInitializer.class);

    private final AdminUserRepository adminUserRepository;
    private final String username;
    private final String password;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AdminDataInitializer(
            AdminUserRepository adminUserRepository,
            @Value("${app.admin.username}") String username,
            @Value("${app.admin.password}") String password) {
        this.adminUserRepository = adminUserRepository;
        this.username = username;
        this.password = password;
    }

    @Override
    public void run(String... args) {
        if (password == null || password.isBlank()) {
            LOGGER.warn("No admin user was created. Set ADMIN_PASSWORD before starting the API.");
            return;
        }
        AdminUser existingAdmin = adminUserRepository.findByUsername(username).orElse(null);

        if (existingAdmin != null) {
            if (!passwordEncoder.matches(password, existingAdmin.getPasswordHash())) {
                existingAdmin.setPasswordHash(passwordEncoder.encode(password));
                adminUserRepository.save(existingAdmin);
                LOGGER.info("Updated the configured admin password for: {}", username);
            }
            return;
        }

        AdminUser adminUser = new AdminUser();
        adminUser.setUsername(username);
        adminUser.setPasswordHash(passwordEncoder.encode(password));
        adminUser.setCreatedAt(LocalDateTime.now());
        adminUserRepository.save(adminUser);
        LOGGER.info("Created the configured admin user: {}", username);
    }
}
