package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.DocumentModele;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DocumentModeleRepository extends JpaRepository<DocumentModele, Long> {
    Optional<DocumentModele> findByType(String type);
}