package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.PlanificationRequest;
import com.wbs.mymovie.estbm.dto.PlanificationSoutenanceResponse;
import com.wbs.mymovie.estbm.dto.SoutenanceEtudiantSlotDto;
import com.wbs.mymovie.estbm.model.DetailSoutenance;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.model.PlanificationSoutenance;
import com.wbs.mymovie.estbm.repository.DetailSoutenanceRepository;
import com.wbs.mymovie.estbm.repository.EtudiantRepository;
import com.wbs.mymovie.estbm.service.PlanificationSoutenanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/stages/planification")
@RequiredArgsConstructor
public class PlanificationSoutenanceController {

    private final PlanificationSoutenanceService service;
    private final EtudiantRepository etudiantRepository;
    private final DetailSoutenanceRepository detailSoutenanceRepository;

    // ADMIN crée une planification
    @PostMapping("/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PlanificationSoutenanceResponse> create(
            @RequestBody PlanificationRequest request
    ) {
        return ResponseEntity.ok(service.createPlanification(request));
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PlanificationSoutenanceResponse>> all() {
        return ResponseEntity.ok(service.getAll());
    }



    // ENCADRANT ajoute les détails d'un étudiant
    @PostMapping("/{planifId}/addDetail")
    @PreAuthorize("hasRole('ENCADRANT')")
    public ResponseEntity<?> addDetail(@PathVariable Long planifId,
                                       @RequestBody DetailSoutenance detail) {
        return ResponseEntity.ok(service.addDetailToPlanification(planifId, detail));
    }

    @GetMapping("/encadrant/{id}")
    @PreAuthorize("hasRole('ENCADRANT')")
    public ResponseEntity<List<PlanificationSoutenanceResponse>> byEncadrant(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.getByEncadrant(id));
    }

//    // ENCADRANT récupère ses planifications
//    @GetMapping("/encadrant/{id}")
//    @PreAuthorize("hasRole('ENCADRANT')")
//    public ResponseEntity<?> getByEncadrant(@PathVariable Long id) {
//        return ResponseEntity.ok(service.getPlanificationsByEncadrant(id));
//    }

//    // ETUDIANT consulte ses détails
//    @GetMapping("/etudiant/{id}")
//    @PreAuthorize("hasRole('ETUDIANT')")
//    public ResponseEntity<?> getByEtudiant(@PathVariable Long id) {
//        return ResponseEntity.ok(service.getDetailsByEtudiant(id));
//    }


    // ETUDIANT : consulter son créneau
    @GetMapping("/etudiant/{id}")
    @PreAuthorize("hasRole('ETUDIANT')")
    public ResponseEntity<List<SoutenanceEtudiantSlotDto>> byEtudiant(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(service.getDetailsByEtudiant(id));
    }

    // ADMIN / ENCADRANT affiche tous les détails
    @GetMapping("/{planifId}/details")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENCADRANT')")
    public ResponseEntity<?> getDetails(@PathVariable Long planifId) {
        return ResponseEntity.ok(service.getDetailsByPlanification(planifId));
    }





    @GetMapping("/planifications/encadrant/{id}/export")
    public ResponseEntity<InputStreamResource> exportToExcel(@PathVariable Long id) throws IOException {
        List<PlanificationSoutenance> planifs = service.getPlanificationsByEncadrant(id);
        ByteArrayInputStream in = service.exportPlanificationsToExcel(planifs);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=planifications.xlsx");

        return ResponseEntity
                .ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }



    // export all planifs for an encadrant
    @GetMapping("/encadrant/{id}/export")
    @PreAuthorize("hasRole('ENCADRANT') or hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> exportPlanifsForEncadrant(@PathVariable Long id) throws IOException {
        ByteArrayInputStream in = service.exportPlanificationsForEncadrantToExcel(id);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=planifications_encadrant_" + id + ".xlsx");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

    // export single planification details
    @GetMapping("/{planifId}/export")
    @PreAuthorize("hasRole('ENCADRANT') or hasRole('ADMIN')")
    public ResponseEntity<InputStreamResource> exportPlanifDetails(@PathVariable Long planifId) throws IOException {
        ByteArrayInputStream in = service.exportPlanificationDetailsToExcel(planifId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=planification_" + planifId + ".xlsx");
        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }


    @GetMapping("/admin/class-groups/{classGroupId}/etudiants")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENCADRANT')")
    public ResponseEntity<List<Etudiant>> getEtudiantsByClassGroup(@PathVariable Long classGroupId) {
        return ResponseEntity.ok(etudiantRepository.findByClasseGroupeId(classGroupId));
    }




    @DeleteMapping("/details/{id}")
    @PreAuthorize("hasRole('ENCADRANT') or hasRole('ADMIN')")
    public ResponseEntity<Void> deleteDetail(@PathVariable Long id) {
        detailSoutenanceRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/details/{id}")
    @PreAuthorize("hasRole('ENCADRANT')")
    public ResponseEntity<DetailSoutenance> updateDetail(@PathVariable Long id, @RequestBody DetailSoutenance detail) {
        return ResponseEntity.ok(service.updateDetail(id, detail));
    }



    @GetMapping("/etudiant/{id}/planifications")
    @PreAuthorize("hasRole('ETUDIANT') or hasRole('ADMIN') or hasRole('ENCADRANT')")
    public ResponseEntity<List<PlanificationSoutenanceResponse>> planificationsForEtudiant(@PathVariable Long id) {
        return ResponseEntity.ok(service.getPlanificationsForEtudiant(id));
    }

}
