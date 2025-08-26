package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.dto.RapportDetailsDto;
import com.wbs.mymovie.estbm.dto.RapportDetailsDto;
import com.wbs.mymovie.estbm.dto.RapportDto;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.model.Rapport;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface RapportRepository extends JpaRepository<Rapport, Long> {

    @EntityGraph(attributePaths = {"stage.etudiant", "stage.encadrant"})
    Optional<Rapport> findByStageId(Long stageId);



    // === requêtes « simples » : on retourne RapportDto (5 champs) ===

    @Query("""
      SELECT new com.wbs.mymovie.estbm.dto.RapportDto(
        r.id,
        r.nomFichier,
        r.dateDepot,
        r.stage.id,
        r.cloudinaryUrl
      )
      FROM Rapport r
      WHERE r.stage.id = :stageId
    """)
    Optional<RapportDto> findDtoByStageId(@Param("stageId") Long stageId);

    @Query("""
      SELECT new com.wbs.mymovie.estbm.dto.RapportDto(
        r.id,
        r.nomFichier,
        r.dateDepot,
        r.stage.id,
        r.cloudinaryUrl
      )
      FROM Rapport r
      WHERE r.stage.encadrant.id = :encadrantId
    """)
    List<RapportDto> findDtoByEncadrantId(@Param("encadrantId") Long encadrantId);







    @Query("SELECT r.cloudinaryUrl FROM Rapport r WHERE r.stage.id = :stageId")
    Optional<String> findCloudinaryUrlByStageId(@Param("stageId") Long stageId);


    @Query("""
    SELECT new com.wbs.mymovie.estbm.dto.RapportDetailsDto(
        r.id,
        r.nomFichier,
        r.dateDepot,
        r.stage.id,
        r.cloudinaryUrl,
        e.id,
        e.nom,
        e.prenom,
        cg.id,
        cg.nom,
        d.id,
        d.nom,
        a.id,
        a.libelle
    )
    FROM Rapport r
    JOIN r.etudiant e
    JOIN e.classeGroupe cg
    JOIN e.departement d
    JOIN e.anneeScolaire a
    WHERE r.stage.encadrant.id = :encId
      AND (:deptId IS NULL OR d.id = :deptId)
      AND (:classeId IS NULL OR cg.id = :classeId)
      AND (:anneeId IS NULL OR a.id = :anneeId)
""")
    List<RapportDetailsDto> findDetailsByEncadrantAndFilters(
            @Param("encId") Long encadrantId,
            @Param("deptId") Long departementId,
            @Param("classeId") Long classeGroupeId,
            @Param("anneeId") Long anneeScolaireId
    );

}