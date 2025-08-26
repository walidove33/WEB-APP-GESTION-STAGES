package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.CommentaireRapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CommentaireRapportRepository extends JpaRepository<CommentaireRapport, Long> {
    List<CommentaireRapport> findByRapportStageEncadrantId(Long encId);
    @Query("""
    SELECT c FROM CommentaireRapport c
     JOIN c.rapport r
     JOIN r.stage s
     JOIN s.etudiant e
    WHERE s.encadrant.id = :encId
      AND (LOWER(e.nom) LIKE LOWER(CONCAT('%',:search,'%'))
        OR LOWER(e.prenom) LIKE LOWER(CONCAT('%',:search,'%')))
  """)
    List<CommentaireRapport> findByEncadrantAndEtudiantNameContains(
            @Param("encId") Long encadrantId,
            @Param("search") String search
    );
}
