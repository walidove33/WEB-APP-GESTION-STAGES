//package com.wbs.mymovie.estbm.model;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.Data;
//
//import java.time.LocalDate;
//
//@Entity
//@Data
//public class Rapport {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    private String nomFichier;
//
//    private LocalDate dateDepot;
//
//    @JsonIgnore
//    @Lob
//    private byte[] data;
//
//
//    @OneToOne
//    @JoinColumn(name = "stage_id")
//    private Stage stage;
//}

// src/main/java/com/wbs/mymovie/estbm/model/Rapport.java
package com.wbs.mymovie.estbm.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nomFichier;
    private LocalDate dateDepot;
    private String cloudinaryUrl; // Stocke l'URL Cloudinary
    private String publicId; // ID unique Cloudinary

    @OneToOne
    @JoinColumn(name = "stage_id")
    @JsonBackReference      // <-- ignore la propriété stage dans le JSON
    private Stage stage;

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;

    @ManyToOne
    @JoinColumn(name = "classe_groupe_id")
    private ClasseGroupe classeGroupe;

    @ManyToOne
    @JoinColumn(name = "annee_scolaire_id")
    private AnneeScolaire anneeScolaire;

}