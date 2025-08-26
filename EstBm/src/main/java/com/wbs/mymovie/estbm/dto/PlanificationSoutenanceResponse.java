package com.wbs.mymovie.estbm.dto;


import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PlanificationSoutenanceResponse {
    private Long id;
    private LocalDate dateSoutenance;
    private EncadrantDetailsDto encadrant;
    private DepartementDto departement;
    private ClasseGroupeDto classeGroupe;
    private AnneeScolaireDto anneeScolaire;
}