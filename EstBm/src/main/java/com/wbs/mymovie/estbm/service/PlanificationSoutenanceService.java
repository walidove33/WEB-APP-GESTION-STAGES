package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.*;
import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.repository.*;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlanificationSoutenanceService {

    private final PlanificationSoutenanceRepository planificationRepo;
    private final DetailSoutenanceRepository detailRepo;
    private final EtudiantRepository etudiantRepo;
    private final EncadrantRepository encadrantRepository;
    private final DepartementRepository departementRepository;
    private final ClasseGroupeRepository classeGroupeRepository;
    private final AnneeScolaireRepository anneeScolaireRepository;



//    public PlanificationSoutenanceResponse createPlanification(PlanificationSoutenance planif) {
//        PlanificationSoutenance saved = planificationRepo.save(planif);
//
//        // Rechargez l'entité avec toutes les associations
//        PlanificationSoutenance fullEntity = planificationRepo.findByIdWithAssociations(saved.getId())
//                .orElseThrow(() -> new RuntimeException("Planification non trouvée après création"));
//
//        return mapToResponseDto(fullEntity);
//    }
//
//    @Transactional
//    public PlanificationSoutenanceResponse createPlanification(
//            @Valid PlanificationRequest req
//    ) {
//        // Parse the ISO-date string into a LocalDate
//        LocalDate date = LocalDate.parse(
//                req.getDateSoutenance(),
//                DateTimeFormatter.ISO_LOCAL_DATE
//        );
//
//        // Build the entity, attaching proxies for each FK
//        PlanificationSoutenance p = new PlanificationSoutenance();
//        p.setDateSoutenance(date);
//        p.setEncadrant(
//                encadrantRepository.getReferenceById(req.getEncadrantId())
//        );
//        p.setDepartement(
//                departementRepository.getReferenceById(req.getDepartementId())
//        );
//        p.setClasseGroupe(
//                classeGroupeRepository.getReferenceById(req.getClasseGroupeId())
//        );
//        p.setAnneeScolaire(
//                anneeScolaireRepository.getReferenceById(req.getAnneeScolaireId())
//        );
//
//        PlanificationSoutenance saved = planificationRepo.save(p);
//        PlanificationSoutenance full  = planificationRepo
//                .findByIdWithAssociations(saved.getId())
//                .orElseThrow(() ->
//                        new RuntimeException("Planification non trouvée après création")
//                );
//
//        return mapToResponseDto(full);
//    }


    @Transactional
    public PlanificationSoutenanceResponse createPlanification(@Valid PlanificationRequest req) {
        // Parse date
        LocalDate date = LocalDate.parse(req.getDateSoutenance(), DateTimeFormatter.ISO_LOCAL_DATE);

        // Build Planification
        PlanificationSoutenance p = new PlanificationSoutenance();
        p.setDateSoutenance(date);

        // ---------- CHANGE: resolve encadrant by utilisateurId ----------
        // The frontend sends encadrantId which is actually the utilisateur.id
        // We resolve the Encadrant entity by the utilisateur id.
        Long utilisateurId = req.getEncadrantId();
        if (utilisateurId == null) {
            throw new IllegalArgumentException("Encadrant (utilisateur) id is required");
        }
        Encadrant enc = encadrantRepository.findByUtilisateurId(utilisateurId)
                .orElseThrow(() -> new RuntimeException(
                        "Encadrant introuvable pour l'utilisateur id = " + utilisateurId +
                                ". Vérifiez que l'encadrant existe et utilisez son utilisateurId."));

        p.setEncadrant(enc);
        // ----------------------------------------------------------------

        // Other references use getReferenceById (still fine)
        p.setDepartement(departementRepository.getReferenceById(req.getDepartementId()));
        p.setClasseGroupe(classeGroupeRepository.getReferenceById(req.getClasseGroupeId()));
        p.setAnneeScolaire(anneeScolaireRepository.getReferenceById(req.getAnneeScolaireId()));

        PlanificationSoutenance saved = planificationRepo.save(p);

        PlanificationSoutenance full = planificationRepo.findByIdWithAssociations(saved.getId())
                .orElseThrow(() -> new RuntimeException("Planification non trouvée après création"));

        return mapToResponseDto(full);
    }

    public List<DetailSoutenance> getDetailsByPlanification(Long planifId) {
        return detailRepo.findByPlanificationId(planifId);
    }

//    public DetailSoutenance addDetailToPlanification(Long planifId, DetailSoutenance detail) {
//        PlanificationSoutenance planif = planificationRepo.findById(planifId)
//                .orElseThrow(() -> new RuntimeException("Planification non trouvée"));
//
//        // Hériter la date de la planification parente
//        detail.setDateSoutenance(planif.getDateSoutenance());
//        detail.setPlanification(planif);
//
//        return detailRepo.save(detail);
//    }




    /**
     * Récupère les détails (créneaux) pour un étudiant.
     */
    // PlanificationSoutenanceService.java
    public List<SoutenanceEtudiantSlotDto> getDetailsByEtudiant(Long etudiantOrUtilisateurId) {

        // 1) Try directly by etudiant id
        List<DetailSoutenance> details = detailRepo.findByEtudiantIdWithPlanification(etudiantOrUtilisateurId);

        // 2) If nothing found, try to resolve as utilisateurId -> etudiant
        if (details == null || details.isEmpty()) {
            Optional<Etudiant> maybe = etudiantRepo.findByUtilisateurId(etudiantOrUtilisateurId);
            if (maybe.isPresent()) {
                Long etuId = maybe.get().getId();
                details = detailRepo.findByEtudiantIdWithPlanification(etuId);
            }
        }

        // 3) Map to DTO (safety for empty)
        if (details == null || details.isEmpty()) return List.of();

        return details.stream().map(d -> {
            SoutenanceEtudiantSlotDto dto = new SoutenanceEtudiantSlotDto();
            dto.setEtudiantId(d.getEtudiant() != null ? d.getEtudiant().getId() : null);
            dto.setDate(d.getDateSoutenance());
            dto.setHeureDebut(d.getHeureDebut());
            dto.setHeureFin(d.getHeureFin());
            dto.setSujet(d.getSujet());
            return dto;
        }).collect(Collectors.toList());
    }



//
//    public List<SoutenanceEtudiantSlotDto> getDetailsByEtudiant(Long etudiantId) {
//        return detailRepo.findByEtudiantId(etudiantId).stream().map(detail -> {
//            SoutenanceEtudiantSlotDto dto = new SoutenanceEtudiantSlotDto();
//            dto.setEtudiantId(detail.getEtudiant().getId());
//            dto.setDate(detail.getDateSoutenance()); // Date récupérée
//            dto.setHeureDebut(detail.getHeureDebut());
//            dto.setHeureFin(detail.getHeureFin());
//            dto.setSujet(detail.getSujet());
//            return dto;
//        }).collect(Collectors.toList());
//    }

    private PlanificationSoutenanceResponse mapToResponseDto(PlanificationSoutenance p) {
        PlanificationSoutenanceResponse r = new PlanificationSoutenanceResponse();
        r.setId(p.getId());
        r.setDateSoutenance(p.getDateSoutenance());

        Encadrant e = p.getEncadrant();
        if (e != null) {
            EncadrantDetailsDto ed = new EncadrantDetailsDto();
            ed.setId(e.getId());
            ed.setNom(e.getNom());
            ed.setPrenom(e.getPrenom());
            ed.setSpecialite(e.getSpecialite());
            if (e.getDepartement() != null) {
                DepartementDto dep = new DepartementDto();
                dep.setId(e.getDepartement().getId());
                dep.setNom(e.getDepartement().getNom());
                ed.setDepartement(dep);
            }
            r.setEncadrant(ed);
        }


        if (p.getDepartement() != null) {
            DepartementDto dep = new DepartementDto();
            dep.setId(p.getDepartement().getId());
            dep.setNom(p.getDepartement().getNom());
            r.setDepartement(dep);
        }
        // Classe
        if (p.getClasseGroupe() != null) {
            ClasseGroupeDto cg = new ClasseGroupeDto();
            cg.setId(p.getClasseGroupe().getId());
            cg.setNom(p.getClasseGroupe().getNom());
            r.setClasseGroupe(cg);
        }
        // Année
        if (p.getAnneeScolaire() != null) {
            AnneeScolaireDto a = new AnneeScolaireDto();
            a.setId(p.getAnneeScolaire().getId());
            a.setLibelle(p.getAnneeScolaire().getLibelle());
            r.setAnneeScolaire(a);
        }

        return r;
    }


    public DetailSoutenance updateDetail(Long detailId, DetailSoutenance updatedDetail) {
        DetailSoutenance existing = detailRepo.findById(detailId)
                .orElseThrow(() -> new RuntimeException("Détail non trouvé"));

        existing.setSujet(updatedDetail.getSujet());
        existing.setHeureDebut(updatedDetail.getHeureDebut());
        existing.setHeureFin(updatedDetail.getHeureFin());

        // Ajouter validation chevauchement ici
        return detailRepo.save(existing);
    }


    public List<PlanificationSoutenanceResponse> getAll() {
        return planificationRepo.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    public ByteArrayInputStream exportPlanificationsToExcel(List<PlanificationSoutenance> planifications) throws IOException {
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Planifications");

            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Date Soutenance");
            header.createCell(1).setCellValue("Departement");
            header.createCell(2).setCellValue("Classe Groupe");
            header.createCell(3).setCellValue("Annee Scolaire");
            header.createCell(4).setCellValue("Encadrant");

            int rowIdx = 1;
            for (PlanificationSoutenance p : planifications) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(p.getDateSoutenance().toString());
                row.createCell(1).setCellValue(p.getDepartement().getNom());
                row.createCell(2).setCellValue(p.getClasseGroupe().getNom());
                row.createCell(3).setCellValue(p.getAnneeScolaire().getLibelle());
                row.createCell(4).setCellValue(p.getEncadrant().getNom() + " " + p.getEncadrant().getPrenom());
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }



    public ByteArrayInputStream exportPlanificationsForEncadrantToExcel(Long encadrantId) throws IOException {
        List<PlanificationSoutenance> planifs = planificationRepo.findByEncadrantId(encadrantId);
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Planifications");
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Id");
            header.createCell(1).setCellValue("Date");
            header.createCell(2).setCellValue("Departement");
            header.createCell(3).setCellValue("ClasseGroupe");
            header.createCell(4).setCellValue("AnneeScolaire");
            header.createCell(5).setCellValue("Encadrant");

            int rowIdx = 1;
            for (PlanificationSoutenance p : planifs) {
                Row r = sheet.createRow(rowIdx++);
                r.createCell(0).setCellValue(p.getId());
                r.createCell(1).setCellValue(p.getDateSoutenance().toString());
                r.createCell(2).setCellValue(p.getDepartement() != null ? p.getDepartement().getNom() : "");
                r.createCell(3).setCellValue(p.getClasseGroupe() != null ? p.getClasseGroupe().getNom() : "");
                r.createCell(4).setCellValue(p.getAnneeScolaire() != null ? p.getAnneeScolaire().getLibelle() : "");
                r.createCell(5).setCellValue(p.getEncadrant() != null ? p.getEncadrant().getNom() + " " + p.getEncadrant().getPrenom() : "");
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public ByteArrayInputStream exportPlanificationDetailsToExcel(Long planifId) throws IOException {
        List<DetailSoutenance> details = detailRepo.findByPlanificationId(planifId);
        try (Workbook workbook = new XSSFWorkbook()) {
            Sheet sheet = workbook.createSheet("Créneaux Planif " + planifId);
            Row header = sheet.createRow(0);
            header.createCell(0).setCellValue("Id");
            header.createCell(1).setCellValue("Date");
            header.createCell(2).setCellValue("Heure Debut");
            header.createCell(3).setCellValue("Heure Fin");
            header.createCell(4).setCellValue("Sujet");
            header.createCell(5).setCellValue("Etudiant Id");
            header.createCell(6).setCellValue("Etudiant Nom");

            int rowIdx = 1;
            for (DetailSoutenance d : details) {
                Row r = sheet.createRow(rowIdx++);
                r.createCell(0).setCellValue(d.getId());
                r.createCell(1).setCellValue(d.getDateSoutenance().toString());
                r.createCell(2).setCellValue(d.getHeureDebut().toString());
                r.createCell(3).setCellValue(d.getHeureFin().toString());
                r.createCell(4).setCellValue(d.getSujet());
                r.createCell(5).setCellValue(d.getEtudiant() != null ? d.getEtudiant().getId() : null);
                r.createCell(6).setCellValue(d.getEtudiant() != null ? d.getEtudiant().getPrenom() + " " + d.getEtudiant().getNom() : "");
            }

            ByteArrayOutputStream out = new ByteArrayOutputStream();
            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }


    // inside PlanificationSoutenanceService

//    public List<PlanificationSoutenanceResponse> getPlanificationsForEtudiant(Long etudiantOrUtilisateurId) {
//        // Try load by etudiant id
//        Optional<Etudiant> opt = etudiantRepo.findById(etudiantOrUtilisateurId);
//        // If not found, try by utilisateur id (common when caller passes JWT userId)
//        if (opt.isEmpty()) {
//            opt = etudiantRepo.findByUtilisateurId(etudiantOrUtilisateurId);
//        }
//        Etudiant etu = opt.orElseThrow(() -> new RuntimeException("Etudiant introuvable pour id = " + etudiantOrUtilisateurId));
//
//        Long cgId = etu.getClasseGroupe() != null ? etu.getClasseGroupe().getId() : null;
//        Long depId = etu.getDepartement() != null ? etu.getDepartement().getId() : null;
//        Long anneeId = etu.getAnneeScolaire() != null ? etu.getAnneeScolaire().getId() : null;
//
//        if (cgId == null || depId == null || anneeId == null) {
//            return List.of();
//        }
//
//        List<PlanificationSoutenance> planifs =
//                planificationRepo.findByClasseGroupeIdAndDepartementIdAndAnneeScolaireId(cgId, depId, anneeId);
//
//        return planifs.stream().map(this::mapToResponseDto).collect(Collectors.toList());
//    }



    public List<PlanificationSoutenanceResponse> getPlanificationsForEtudiant(Long etudiantOrUtilisateurId) {
        Optional<Etudiant> opt = etudiantRepo.findById(etudiantOrUtilisateurId);
        if (opt.isEmpty()) {
            opt = etudiantRepo.findByUtilisateurId(etudiantOrUtilisateurId);
        }
        Etudiant etu = opt.orElseThrow(() -> new RuntimeException("Etudiant introuvable pour id = " + etudiantOrUtilisateurId));

        Long cgId = etu.getClasseGroupe() != null ? etu.getClasseGroupe().getId() : null;
        Long depId = etu.getDepartement() != null ? etu.getDepartement().getId() : null;
        Long anneeId = etu.getAnneeScolaire() != null ? etu.getAnneeScolaire().getId() : null;

        if (cgId == null || depId == null || anneeId == null) {
            // fallback : retourner les planifications liées aux détails de cet étudiant
            List<DetailSoutenance> details = detailRepo.findByEtudiantIdWithPlanification(etu.getId());
            return details.stream()
                    .map(DetailSoutenance::getPlanification)
                    .filter(java.util.Objects::nonNull)
                    .distinct()
                    .map(this::mapToResponseDto)
                    .collect(Collectors.toList());
        }

        List<PlanificationSoutenance> planifs =
                planificationRepo.findByClasseGroupeIdAndDepartementIdAndAnneeScolaireId(cgId, depId, anneeId);

        if (planifs.isEmpty()) {
            // second fallback: check details linked to this student (utile si FKs incohérents)
            List<DetailSoutenance> details = detailRepo.findByEtudiantIdWithPlanification(etu.getId());
            return details.stream()
                    .map(DetailSoutenance::getPlanification)
                    .filter(java.util.Objects::nonNull)
                    .distinct()
                    .map(this::mapToResponseDto)
                    .collect(Collectors.toList());
        }

        return planifs.stream().map(this::mapToResponseDto).collect(Collectors.toList());
    }


    // PlanificationSoutenanceService.java

    // Remplace l'ancienne méthode getPlanificationsByEncadrant
    public List<PlanificationSoutenance> getPlanificationsByEncadrant(Long encadrantOrUtilisateurId) {
        // 1) Try direct encadrant id
        List<PlanificationSoutenance> planifs = planificationRepo.findByEncadrantId(encadrantOrUtilisateurId);
        if (planifs != null && !planifs.isEmpty()) {
            return planifs;
        }

        // 2) If empty, try resolve as utilisateurId -> encadrant
        Optional<Encadrant> encOpt = encadrantRepository.findByUtilisateurId(encadrantOrUtilisateurId);
        if (encOpt.isPresent()) {
            Long encId = encOpt.get().getId();
            planifs = planificationRepo.findByEncadrantId(encId);
            return planifs != null ? planifs : List.of();
        }

        // 3) Nothing found -> return empty list
        return List.of();
    }

    // Remplace l'ancienne méthode getByEncadrant (utilisée par controller)
    public List<PlanificationSoutenanceResponse> getByEncadrant(Long encadrantOrUtilisateurId) {
        return getPlanificationsByEncadrant(encadrantOrUtilisateurId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }




    public DetailSoutenance addDetailToPlanification(Long planifId, DetailSoutenance detail) {
        PlanificationSoutenance planif = planificationRepo.findById(planifId)
                .orElseThrow(() -> new RuntimeException("Planification non trouvée"));

        // Hérite la date de la planif
        detail.setDateSoutenance(planif.getDateSoutenance());
        detail.setPlanification(planif);

        // Resolve student: accept either etudiant.id or utilisateur.id
        if (detail.getEtudiant() != null && detail.getEtudiant().getId() != null) {
            Long providedId = detail.getEtudiant().getId();
            Optional<Etudiant> opt = etudiantRepo.findById(providedId);
            if (opt.isEmpty()) {
                opt = etudiantRepo.findByUtilisateurId(providedId);
            }
            Etudiant etu = opt.orElseThrow(() -> new RuntimeException("Etudiant introuvable pour id = " + providedId));
            detail.setEtudiant(etu); // set managed entity before saving
        } else {
            throw new IllegalArgumentException("Etudiant requis pour un détail de soutenance");
        }

        return detailRepo.save(detail);
    }



}
