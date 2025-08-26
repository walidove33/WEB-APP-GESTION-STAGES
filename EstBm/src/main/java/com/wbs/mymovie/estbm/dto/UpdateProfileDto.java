package com.wbs.mymovie.estbm.dto;

import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

@Getter
@Setter
public class UpdateProfileDto {
    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private MultipartFile profilePicture; // photo de profil uploadée
}
