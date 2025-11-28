package com.Caminhar.api.model;

import com.Caminhar.api.DTO.RegistroConsultaRequestDTO;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;


@Entity (name = "RegistroConsultas")
@Table (name = "RegistroConsultas")
@EqualsAndHashCode(of = "id")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RegistroConsultas {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String consulta;

    @Column(columnDefinition = "TEXT")
    private String sintomas;

    @Column(columnDefinition = "TEXT")
    private String diagnostico;

    @Column(columnDefinition = "TEXT")
    private  String exames;

    private LocalDate dataRegistro;

    public RegistroConsultas(RegistroConsultaRequestDTO dto) {
        this.consulta = dto.consulta();
        this.sintomas = dto.sintomas();
        this.diagnostico = dto.diagnostico();
        this.exames = dto.exames();
        this.dataRegistro = dto.dataRegistro();
    }

    public void atualizar(RegistroConsultaRequestDTO dto) {
        this.consulta = dto.consulta();
        this.sintomas = dto.sintomas();
        this.diagnostico = dto.diagnostico();
        this.exames = dto.exames();
        this.dataRegistro = dto.dataRegistro();
    }
}
