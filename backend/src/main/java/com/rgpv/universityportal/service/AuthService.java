package com.rgpv.universityportal.service;

import com.rgpv.universityportal.dto.AuthResponse;
import com.rgpv.universityportal.dto.LoginRequest;
import com.rgpv.universityportal.model.AdminUser;
import com.rgpv.universityportal.repository.AdminUserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private final AdminUserRepository adminUserRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public AuthService(AdminUserRepository adminUserRepository, JwtService jwtService) {
        this.adminUserRepository = adminUserRepository;
        this.jwtService = jwtService;
    }

    public AuthResponse login(LoginRequest request) {
        AdminUser user = adminUserRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> unauthorized());

        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw unauthorized();
        }

        return new AuthResponse(
                jwtService.createToken(user.getUsername()),
                user.getUsername(),
                jwtService.expirationInSeconds());
    }

    private ResponseStatusException unauthorized() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid username or password");
    }
}
