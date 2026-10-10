package com.fittrack.auth.dto;

public record AuthResponse(String token, Long userId, String displayName, String email) {
}
