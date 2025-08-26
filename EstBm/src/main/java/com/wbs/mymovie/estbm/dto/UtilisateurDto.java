package com.wbs.mymovie.estbm.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class UtilisateurDto {
    private Long id;
    private String email;
    private String nom;
    private String prenom;
    private String telephone;
    private String role;
    // getters + setters
}
