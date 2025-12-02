package com.Caminhar.api.repository;

import com.Caminhar.api.model.RegistroConsultas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;

public interface RegistroConsultasRepository extends JpaRepository<RegistroConsultas, Long> {

    @Query("SELECT COUNT(r) FROM RegistroConsultas r WHERE r.dataRegistro = :data")
    long countByData(@Param("data") LocalDate data);

    long countByDataRegistroAfter(LocalDate data);

    // Solução mais segura - evita problemas com CURRENT_DATE
    default long countUltimos30Dias() {
        LocalDate trintaDiasAtras = LocalDate.now().minusDays(30);
        return countByDataRegistroAfter(trintaDiasAtras);
    }

    // Ou se quiser manter a anotação @Query
    @Query("SELECT COUNT(r) FROM RegistroConsultas r WHERE r.dataRegistro >= :dataLimite")
    long countFromDate(@Param("dataLimite") LocalDate dataLimite);
}