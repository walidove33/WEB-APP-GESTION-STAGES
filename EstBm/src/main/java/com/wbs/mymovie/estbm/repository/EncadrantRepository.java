package com.wbs.mymovie.estbm.repository;

import com.wbs.mymovie.estbm.model.Encadrant;
import com.wbs.mymovie.estbm.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


import org.springframework.stereotype.Repository;

@Repository
public interface EncadrantRepository extends JpaRepository<Encadrant, Long> {
    Optional<Encadrant> findByEmail(String email);

    Optional<Encadrant> findByUtilisateur(Utilisateur utilisateur);

    List<Encadrant> findByDepartementId(Long departementId);


    Optional<Encadrant> findByUtilisateurId(Long utilisateurId);


}
