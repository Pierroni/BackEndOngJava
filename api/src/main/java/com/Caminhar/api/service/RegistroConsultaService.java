package com.Caminhar.api.service;

import com.Caminhar.api.DTO.RegistroConsultaRequestDTO;
import com.Caminhar.api.DTO.RegistroConsultaResponseDTO;
import com.Caminhar.api.model.RegistroConsultas;
import com.Caminhar.api.repository.RegistroConsultaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RegistroConsultaService {

    @Autowired
    private RegistroConsultaRepository repository;

    public List<RegistroConsultaResponseDTO> listar() {
        return repository.findAll()
                .stream()
                .map(RegistroConsultaResponseDTO::new)
                .toList();
    }

    public RegistroConsultaResponseDTO findById(Long id) {
        RegistroConsultas registro = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de consulta não encontrado"));
        return new RegistroConsultaResponseDTO(registro);
    }

    public RegistroConsultaResponseDTO create(RegistroConsultaRequestDTO dto) {
        RegistroConsultas novo = new RegistroConsultas(dto);
        repository.save(novo);
        return new RegistroConsultaResponseDTO(novo);
    }

    public RegistroConsultaResponseDTO update(Long id, RegistroConsultaRequestDTO dto) {
        RegistroConsultas registro = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Registro de consulta não encontrado"));

        registro.atualizar(dto);
        repository.save(registro);

        return new RegistroConsultaResponseDTO(registro);
    }

    public void delete(Long id) {
        if (!repository.existsById(id)) {
            throw new RuntimeException("Registro não encontrado para deletar");
        }
        repository.deleteById(id);
    }
}