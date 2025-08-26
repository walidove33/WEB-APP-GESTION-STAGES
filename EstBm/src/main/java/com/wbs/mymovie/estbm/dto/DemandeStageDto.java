package com.wbs.mymovie.estbm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class DemandeStageDto {
    private Long idEtudiant;
    private String sujet;
    private String entreprise;
    private String adresseEntreprise;  // Nouveau champ
    private String telephoneEntreprise;  // Nouveau champ
    private String representantEntreprise;  // Nouveau champ
    private String filiere;
    private LocalDate dateDebut;
    private LocalDate dateFin;

}