// src/main/java/com/wbs/mymovie/estbm/dto/RapportDetailsDto.java
package com.wbs.mymovie.estbm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RapportDetailsDto {
    private Long rapportId;
    private String nomFichier;
    private LocalDate dateDepot;
    private Long stageId;
    private String cloudinaryUrl;

    private Long etudiantId;
    private String etudiantNom;
    private String etudiantPrenom;

    private Long classeGroupeId;
    private String classeGroupeNom;

    private Long departementId;
    private String departementNom;

    private Long anneeScolaireId;
    private String anneeScolaireValeur;
}
