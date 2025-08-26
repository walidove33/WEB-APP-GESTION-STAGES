package com.wbs.mymovie.estbm.dto;

import lombok.Data;

@Data
public class EncadrantDetailsDto {
    private Long id;
    private String nom;
    private String prenom;
    private String specialite;
    private DepartementDto departement;
}