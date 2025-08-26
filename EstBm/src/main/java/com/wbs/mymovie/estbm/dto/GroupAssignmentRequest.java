package com.wbs.mymovie.estbm.dto;

import lombok.Data;

@Data
public class GroupAssignmentRequest {
    private Long encadrantId;
    private Long departementId;
    private Long classeGroupeId;
    private Long anneeScolaireId;
}