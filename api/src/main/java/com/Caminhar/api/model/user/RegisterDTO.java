package com.Caminhar.api.model.user;

public record RegisterDTO(String login, String password, UserRole role) {
}
