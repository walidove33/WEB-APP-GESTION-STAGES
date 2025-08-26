package com.wbs.mymovie.estbm.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PlanificationSoutenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dateSoutenance;

    @ManyToOne
    private Departement departement;

    @ManyToOne
    private ClasseGroupe classeGroupe;

    @ManyToOne
    private AnneeScolaire anneeScolaire;

    @ManyToOne
    private Encadrant encadrant;

    @OneToMany(mappedBy = "planification", cascade = CascadeType.ALL)
    @JsonIgnore // Add this to break the serialization loop
    private List<DetailSoutenance> details;
}
