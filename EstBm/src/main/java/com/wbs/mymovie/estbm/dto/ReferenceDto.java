package com.wbs.mymovie.estbm.dto;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ReferenceDto {
    private Long id;
    private String nom;      // pour Departement et ClasseGroupe
    private String libelle;  // pour AnneeScolaire (vous pouvez laisser nom vide)
}
