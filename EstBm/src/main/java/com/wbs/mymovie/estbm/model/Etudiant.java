package com.wbs.mymovie.estbm.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.wbs.mymovie.estbm.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

import com.wbs.mymovie.estbm.model.Document;


@Entity
@Table(name = "etudiants")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"stages","utilisateur"})
public class Etudiant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codeApogee;

    @Column(nullable = false, unique = true)
    private String codeMassar;

    @Column(nullable = false)
    private LocalDate dateNaissance;

    private String nom;
    private String prenom;
    private String email;
    private String telephone;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", referencedColumnName = "id")
    private Utilisateur utilisateur;



    @ManyToOne
    @JoinColumn(name = "encadrant_id")
    @JsonIgnoreProperties("etudiants") // Ajouter cette annotation
    private Encadrant encadrant;

    @OneToMany(mappedBy = "etudiant", cascade = CascadeType.ALL)
    private List<Document> documents;


    @ManyToOne
    @JoinColumn(name = "departement_id")
    @JsonBackReference("etudiant-departement")
    private Departement departement;

    @ManyToOne
    @JoinColumn(name = "classe_groupe_id")
    @JsonBackReference("etudiant-classe")
    private ClasseGroupe classeGroupe;

    @ManyToOne
    @JoinColumn(name = "annee_scolaire_id")
    private AnneeScolaire anneeScolaire;

}
