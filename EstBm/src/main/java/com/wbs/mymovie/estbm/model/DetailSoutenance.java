package com.wbs.mymovie.estbm.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DetailSoutenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String sujet;

    private LocalDate dateSoutenance; // Nouveau champ

    private LocalTime heureDebut;
    private LocalTime heureFin;

    @ManyToOne
    @JsonBackReference(value = "etudiant-detail")
    private Etudiant etudiant;

    @ManyToOne
    @JsonBackReference(value = "planif-detail")
    private PlanificationSoutenance planification;
}
