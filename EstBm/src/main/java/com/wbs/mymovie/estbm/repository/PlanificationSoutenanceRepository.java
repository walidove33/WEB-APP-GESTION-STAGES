package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.PlanificationSoutenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanificationSoutenanceRepository extends JpaRepository<PlanificationSoutenance, Long> {
    List<PlanificationSoutenance> findByEncadrantId(Long encadrantId);
    List<PlanificationSoutenance> findByClasseGroupeId(Long classeGroupeId);
    @Query("SELECT p FROM PlanificationSoutenance p " +
            "LEFT JOIN FETCH p.encadrant e " +
            "LEFT JOIN FETCH e.departement " +
            "LEFT JOIN FETCH p.departement " +
            "LEFT JOIN FETCH p.classeGroupe " +
            "LEFT JOIN FETCH p.anneeScolaire " +
            "WHERE p.id = :id")
    Optional<PlanificationSoutenance> findByIdWithAssociations(Long id);


    List<PlanificationSoutenance> findByClasseGroupeIdAndDepartementIdAndAnneeScolaireId(
            Long classeGroupeId, Long departementId, Long anneeScolaireId);
}
