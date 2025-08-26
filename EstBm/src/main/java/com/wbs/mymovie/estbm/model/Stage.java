package com.wbs.mymovie.estbm.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.wbs.mymovie.estbm.model.enums.EtatStage;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "stages")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"etudiant", "encadrant", "documents"})
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sujet;
    private String entreprise;
    private String adresseEntreprise;  // Nouveau champ
    private String telephoneEntreprise;  // Nouveau champ
    private String representantEntreprise;  // Nouveau champ
    private LocalDate dateDebut;
    private LocalDate dateFin;

    @Enumerated(EnumType.STRING)
    private EtatStage etat; // EN_ATTENTE, VALIDE, REFUSE

    @ManyToOne
    @JoinColumn(name = "etudiant_id")
    private Etudiant etudiant;

    @ManyToOne
    @JoinColumn(name = "encadrant_id")
    private Encadrant encadrant;

    private String note; // commentaire rédigé par l'encadrant

    private String filiere; // filière de l'étudiant

    @OneToOne(mappedBy = "stage", fetch = FetchType.LAZY)
    @JsonManagedReference   // <-- sérialise le rapport, ignore la backref
    private Rapport rapport;



    @Column(name = "date_creation")
    private LocalDateTime dateCreation;

    @PrePersist
    protected void onCreate() {
        this.dateCreation = LocalDateTime.now();
    }
}