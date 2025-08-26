package com.wbs.mymovie.estbm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class SoutenanceEtudiantSlotDto {
    private Long etudiantId;
    private LocalTime heureDebut;
    private LocalTime heureFin;
    private String sujet;
    private LocalDate date; // Nouveau champ

}
