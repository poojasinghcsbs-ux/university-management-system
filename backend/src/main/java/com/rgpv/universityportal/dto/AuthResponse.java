package com.rgpv.universityportal.dto;

public record AuthResponse(String token, String username, long expiresInSeconds) {
}
