package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByEtudiantId(Long etudiantId);
    List<Document> findByStageId(Long stageId);
    @Query("SELECT d FROM Document d JOIN d.stage s WHERE s.encadrant.id = :encadrantId")
    List<Document> findByEncadrantId(@Param("encadrantId") Long encadrantId);
}