package com.wbs.mymovie.estbm.repository;


import com.wbs.mymovie.estbm.model.ClasseGroupe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClasseGroupeRepository extends JpaRepository<ClasseGroupe, Long> {
    Optional<ClasseGroupe> findByNom(String nom);

    List<ClasseGroupe> findByDepartement_Id(Long departementId);

}