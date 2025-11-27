package com.Caminhar.api.model;

import com.Caminhar.api.DTO.PacientesRequestDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;


@Table (name = "pacientes")
@Entity (name = "pacientes")
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(of = "id")
@Getter
@Setter
public class Pacientes {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomePas;

    private String cpf;

    private LocalDate dataNascimento;

    private String cep;

    private String telefone;

    private String endereco;

    @Column(columnDefinition = "TEXT")
    private String observacoes;

    private boolean obito;


    public Pacientes(PacientesRequestDTO dto) {
        this.nomePas = dto.nomePas();
        this.cpf = dto.cpf();
        this.dataNascimento = dto.dataNascimento();
        this.cep = dto.cep();
        this.telefone = dto.telefone();
        this.endereco = dto.endereco();
        this.observacoes = dto.observacoes();
        this.obito = dto.obito();
    }

    public void atualizar(PacientesRequestDTO dto) {
        this.nomePas = dto.nomePas();
        this.cpf = dto.cpf();
        this.dataNascimento = dto.dataNascimento();
        this.cep = dto.cep();
        this.telefone = dto.telefone();
        this.endereco = dto.endereco();
        this.observacoes = dto.observacoes();
        this.obito = dto.obito();
    }
}
