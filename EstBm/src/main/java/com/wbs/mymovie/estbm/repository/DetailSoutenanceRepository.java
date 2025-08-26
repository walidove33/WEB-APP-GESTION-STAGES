package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.DetailSoutenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DetailSoutenanceRepository extends JpaRepository<DetailSoutenance, Long> {
    List<DetailSoutenance> findByPlanificationId(Long planificationId);
    List<DetailSoutenance> findByEtudiantId(Long etudiantId);

    @Query("SELECT d FROM DetailSoutenance d JOIN FETCH d.planification WHERE d.etudiant.id = :etudiantId")
    List<DetailSoutenance> findByEtudiantIdWithPlanification(Long etudiantId);
}
