package com.wbs.mymovie.estbm.repository;


import com.wbs.mymovie.estbm.model.AnneeScolaire;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AnneeScolaireRepository extends JpaRepository<AnneeScolaire, Long> {
    Optional<AnneeScolaire> findByLibelle(String libelle);
}
