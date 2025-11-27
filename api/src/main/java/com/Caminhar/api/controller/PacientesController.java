package com.Caminhar.api.controller;

import com.Caminhar.api.DTO.PacientesRequestDTO;
import com.Caminhar.api.DTO.PacientesResponseDTO;
import com.Caminhar.api.service.PacientesService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("pacientes")
public class PacientesController {

    @Autowired
    private PacientesService service;

    @GetMapping
    public List<PacientesResponseDTO> GetAll() {
        return service.listar();
    }

    @PostMapping
    public PacientesResponseDTO criar(@RequestBody PacientesRequestDTO dto) {
        return service.criar(dto);
    }

    @PutMapping("/{id}")
    public PacientesResponseDTO atualizar(@PathVariable Long id, @RequestBody PacientesRequestDTO dto) {
        return service.atualizar(id, dto);
    }

    @DeleteMapping("/{id}")
    public void deletar(@PathVariable Long id) {
        service.deletar(id);
    }
}
