package com.wbs.mymovie.estbm.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SoutenancePlanificationDto {
    private Long id;
    private LocalDate date;
    private Long encadrantId;
    private Long classeId;
    private Long departementId;
    private Long anneeScolaireId;
}
