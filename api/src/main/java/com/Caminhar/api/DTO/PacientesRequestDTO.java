package com.Caminhar.api.DTO;

import java.time.LocalDate;

public record PacientesRequestDTO(String cpf, String nomePas, LocalDate dataNascimento, String cep, String telefone, String endereco, String observacoes, Boolean obito) {
}
