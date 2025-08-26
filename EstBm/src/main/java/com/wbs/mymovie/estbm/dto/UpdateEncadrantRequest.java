package com.wbs.mymovie.estbm.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class UpdateEncadrantRequest {
    @NotBlank
    private String nom;
    @NotBlank
    private String prenom;
    private String telephone;
    private String specialite;
}
