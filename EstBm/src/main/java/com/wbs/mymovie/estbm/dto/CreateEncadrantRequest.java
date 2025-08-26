package com.wbs.mymovie.estbm.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
public class CreateEncadrantRequest {
    @Email @NotBlank
    private String email;

    @NotBlank @Size(min = 6)
    private String password;

    @NotBlank
    private String nom;

    @NotBlank
    private String prenom;

    private String telephone;
    private String specialite;
}
