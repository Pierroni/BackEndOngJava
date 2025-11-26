package com.Caminhar.api.repository;

import com.Caminhar.api.model.Pacientes;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PacientesRepository extends JpaRepository<Pacientes, Long> {
}
