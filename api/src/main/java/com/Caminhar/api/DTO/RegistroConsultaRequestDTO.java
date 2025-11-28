package com.Caminhar.api.DTO;

import java.time.LocalDate;

public record RegistroConsultaRequestDTO(String consulta, String sintomas, String diagnostico, String exames, LocalDate dataRegistro){
}
