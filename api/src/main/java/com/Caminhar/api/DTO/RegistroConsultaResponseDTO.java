package com.Caminhar.api.DTO;

import com.Caminhar.api.model.RegistroConsultas;
import java.time.LocalDate;

public record RegistroConsultaResponseDTO(Long id, String consulta, String sintomas, String diagnostico, String exames, LocalDate dataRegistro){


    public RegistroConsultaResponseDTO(RegistroConsultas r){
        this(r.getId(), r.getConsulta(), r.getSintomas(), r.getDiagnostico(), r.getExames(), r.getDataRegistro());
    }
}