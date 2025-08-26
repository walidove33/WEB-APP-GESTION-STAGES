// RegisterRequest.java
package com.wbs.mymovie.estbm.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter @Setter
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String specialite;
    private String codeApogee;
    private String codeMassar;
    private LocalDate dateNaissance;
    private String email;
    private String password;
    private String telephone;
}
