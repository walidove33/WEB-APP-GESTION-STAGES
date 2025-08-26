package com.wbs.mymovie.estbm.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class EtudiantProfileDto {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String codeApogee;
    private String codeMassar;
    private LocalDate dateNaissance;
    private DepartementDto departement;
    private ClasseGroupeDto classeGroupe;
    private AnneeScolaireDto anneeScolaire;
}