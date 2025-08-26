package com.wbs.mymovie.estbm.dto;

public class PlanificationRequest {
    private String dateSoutenance;   // e.g. "2025-08-06"
    private Long encadrantId;
    private Long departementId;
    private Long classeGroupeId;
    private Long anneeScolaireId;

    // Getters and Setters
    public String getDateSoutenance() { return dateSoutenance; }
    public void setDateSoutenance(String dateSoutenance) { this.dateSoutenance = dateSoutenance; }

    public Long getEncadrantId() { return encadrantId; }
    public void setEncadrantId(Long encadrantId) { this.encadrantId = encadrantId; }

    public Long getDepartementId() { return departementId; }
    public void setDepartementId(Long departementId) { this.departementId = departementId; }

    public Long getClasseGroupeId() { return classeGroupeId; }
    public void setClasseGroupeId(Long classeGroupeId) { this.classeGroupeId = classeGroupeId; }

    public Long getAnneeScolaireId() { return anneeScolaireId; }
    public void setAnneeScolaireId(Long anneeScolaireId) { this.anneeScolaireId = anneeScolaireId; }
}