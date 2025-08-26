//// src/main/java/com/wbs/mymovie/estbm/dto/RapportDto.java
//package com.wbs.mymovie.estbm.dto;
//
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import java.time.LocalDate;
//
///**
// * DTO pour exposer les métadonnées du rapport sans le contenu binaire.
// */
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//public class RapportDto {
//    private Long id;
//    private String nom;
//    private String dateUpload;
//    private Long stageId;
//
//    public RapportDto(Long id, String nomFichier, LocalDate dateDepot,  Long stageId) {
//        this.id = id;
//        this.nom = nomFichier;
//        this.dateUpload = dateDepot != null ? dateDepot.toString() : null;
//        this.stageId = stageId;
//    }
//
//}


// RapportDto.java
package com.wbs.mymovie.estbm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RapportDto {
    private Long id;
    private String nom;
    private String dateUpload;
    private Long stageId;
    private String cloudinaryUrl; // Ajouté

    // Constructeur mis à jour avec 5 paramètres
    public RapportDto(Long id, String nomFichier, LocalDate dateDepot, Long stageId, String cloudinaryUrl) {
        this.id = id;
        this.nom = nomFichier;
        this.dateUpload = dateDepot != null ? dateDepot.toString() : null;
        this.stageId = stageId;
        this.cloudinaryUrl = cloudinaryUrl;
    }

    }
