package com.Caminhar.api.DTO;

public record DashboardStatsDTO(
        long totalPacientes,
        long prontuariosHoje,
        long novosRegistros
) {}