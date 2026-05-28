package com.Caminhar.api.DTO;

import com.Caminhar.api.model.user.UserRole;

public record RegisterDTO(String login, String password, UserRole role) {
}
