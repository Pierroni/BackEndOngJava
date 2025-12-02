package com.Caminhar.api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.Caminhar.api.repository.PacientesRepository;
import com.Caminhar.api.repository.RegistroConsultasRepository;
import com.Caminhar.api.DTO.DashboardStatsDTO;

import java.time.LocalDate;

@RestController
@RequestMapping("/dashboard")
public class DashboardController {

    @Autowired
    private PacientesRepository pacientesRepository;

    @Autowired
    private RegistroConsultasRepository registroConsultasRepository;

    @GetMapping("/stats")
    public DashboardStatsDTO getStats() {

        long totalPacientes = pacientesRepository.count();
        long prontuariosHoje = registroConsultasRepository.countByData(LocalDate.now());
        long novosRegistros = registroConsultasRepository.countUltimos30Dias();

        return new DashboardStatsDTO(
                totalPacientes,
                prontuariosHoje,
                novosRegistros
        );
    }
}