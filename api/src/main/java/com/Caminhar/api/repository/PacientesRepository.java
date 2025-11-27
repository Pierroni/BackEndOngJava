package com.Caminhar.api.repository;

import com.Caminhar.api.model.Pacientes;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface PacientesRepository extends JpaRepository<Pacientes, Long>{
}
