package com.wbs.mymovie.estbm.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Entity
@Table(name = "encadrants")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@JsonIgnoreProperties({"etudiants","utilisateur"})
public class Encadrant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nom;
    private String prenom;
    private String email;
    private String telephone;

    private String specialite;

    @OneToOne
    @JoinColumn(name = "utilisateur_id", referencedColumnName = "id")
    private Utilisateur utilisateur;


    @OneToMany(mappedBy = "encadrant")
    @JsonIgnoreProperties("encadrant") // Ajouter cette annotation
    private List<Etudiant> etudiants;


    @ManyToOne
    @JoinColumn(name = "departement_id")
    private Departement departement;


}