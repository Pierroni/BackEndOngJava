package com.Caminhar.api.DTO;

import com.Caminhar.api.model.Pacientes;

import java.time.LocalDate;
import java.util.UUID;

public record PacientesResponseDTO(Long id, String cpf, String nome, LocalDate dataNascimento, String cep,String telefone, String endereco, String observacoes, Boolean obito) {

    public PacientesResponseDTO(Pacientes p){
        this(p.getId(), p.getCpf(), p.getNomePas(), p.getDataNascimento(), p.getCep(), p.getTelefone(), p.getEndereco(), p.getObservacoes(), p.isObito());

    }

}
