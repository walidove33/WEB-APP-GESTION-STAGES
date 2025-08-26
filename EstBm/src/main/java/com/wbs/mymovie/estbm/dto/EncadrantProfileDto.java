package com.wbs.mymovie.estbm.dto;

import lombok.Data;

@Data
public class EncadrantProfileDto {
    private Long id;
    private String nom;
    private String prenom;
    private String email;
    private String specialite;
    private DepartementDto departement;
}