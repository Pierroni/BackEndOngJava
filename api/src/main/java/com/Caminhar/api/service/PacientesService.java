package com.Caminhar.api.service;

import com.Caminhar.api.DTO.PacientesRequestDTO;
import com.Caminhar.api.DTO.PacientesResponseDTO;
import com.Caminhar.api.utils.CpfVerif;
import com.Caminhar.api.model.Pacientes;
import com.Caminhar.api.repository.PacientesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class PacientesService {

    @Autowired
    private PacientesRepository repository;

    public List<PacientesResponseDTO> listar(){
        return repository.findAll().stream().map(PacientesResponseDTO::new).toList();
    }


    public PacientesResponseDTO findById(Long id) {
        Pacientes paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));
        return  new PacientesResponseDTO(paciente);
    }


    public PacientesResponseDTO criar(PacientesRequestDTO dto){

        if (!CpfVerif.cpfValido(dto.cpf())) {
            throw new RuntimeException("CPF inválido");
        }

        Pacientes paciente = new Pacientes(dto);

        repository.save(paciente);

        return new PacientesResponseDTO(paciente);
    }


    public PacientesResponseDTO atualizar(Long id, PacientesRequestDTO dto) {

        if (!CpfVerif.cpfValido(dto.cpf())) {
            throw new RuntimeException("CPF inválido");
        }

        Pacientes paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        paciente.atualizar(dto);

        repository.save(paciente);

        return new PacientesResponseDTO(paciente);
    }


    public void deletar(Long id) {

        Pacientes paciente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Paciente não encontrado"));

        repository.delete(paciente);
    }
}

