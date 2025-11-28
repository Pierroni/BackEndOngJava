package com.Caminhar.api.controller;

import com.Caminhar.api.DTO.RegistroConsultaRequestDTO;
import com.Caminhar.api.DTO.RegistroConsultaResponseDTO;
import com.Caminhar.api.service.RegistroConsultaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/registro-consultas")
public class RegistroConsultaController {

@Autowired
    private RegistroConsultaService service;

    @GetMapping
    public List<RegistroConsultaResponseDTO> listar() {
        return service.listar();
    }

    @GetMapping("/{id}")
    public RegistroConsultaResponseDTO findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public RegistroConsultaResponseDTO create(@RequestBody RegistroConsultaRequestDTO dto) {
        return service.create(dto);
    }

    @PutMapping("/{id}")
    public RegistroConsultaResponseDTO update(@PathVariable Long id, @RequestBody RegistroConsultaRequestDTO dto) {
        return service.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}