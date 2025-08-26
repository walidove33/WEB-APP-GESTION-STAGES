//package com.wbs.mymovie.estbm.controller;
//
//import com.wbs.mymovie.estbm.model.Rapport;
//import com.wbs.mymovie.estbm.service.RapportService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//@RestController
//@RequestMapping("/stages/rapports")
//public class RapportController {
//
//    @Autowired
//    private RapportService rapportService;
//
//    @PostMapping("/")
//    public ResponseEntity<Rapport> uploadRapport(@RequestBody Rapport rapport) {
//        return ResponseEntity.ok(rapportService.enregistrer(rapport));
//    }
//
//    @GetMapping("/stage/{id}")
//    public ResponseEntity<Rapport> getRapport(@PathVariable Long id) {
//        return rapportService.parStage(id)
//                .map(ResponseEntity::ok)
//                .orElse(ResponseEntity.notFound().build());
//    }
//}



// src/main/java/com/wbs/mymovie/estbm/controller/RapportController.java
package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.RapportDetailsDto;
import com.wbs.mymovie.estbm.exception.ResourceNotFoundException;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.model.Rapport;
import com.wbs.mymovie.estbm.model.Stage;
import com.wbs.mymovie.estbm.repository.RapportRepository;
import com.wbs.mymovie.estbm.service.RapportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import com.wbs.mymovie.estbm.service.StageService;

import java.net.URI;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/stages/rapports")
public class RapportController {

    @Autowired
    private StageService stageService;


    @Autowired
    private RapportRepository rapportRepository;

    @Autowired
    private RapportService rapportService;

    /**
     * Soumettre un rapport pour un stage donné.
     */
//    @PostMapping("/{idStage}")
//    @PreAuthorize("hasRole('ETUDIANT')")
//    public ResponseEntity<String> uploadRapport(
//            @PathVariable Long idStage,
//            @RequestParam("file") MultipartFile file) {
//
//        if (file.isEmpty()) {
//            return ResponseEntity.badRequest().body("Fichier vide");
//        }
//
//        if (!file.getContentType().equals("application/pdf")) {
//            return ResponseEntity.badRequest().body("Seuls les PDF sont acceptés");
//        }
//
//        String result = stageService.soumettreRapport(idStage, file);
//        return ResponseEntity.ok(result);
//    }



    @PostMapping("/{idStage}")
    public ResponseEntity<String> uploadRapport(
            @PathVariable Long idStage,
            @RequestParam("file") MultipartFile file) {

        // Validation du fichier
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Fichier vide");
        }

        if (!"application/pdf".equals(file.getContentType())) {
            return ResponseEntity.badRequest().body("Seuls les PDF sont acceptés");
        }

        try {
            String result = stageService.soumettreRapport(idStage, file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Erreur: " + e.getMessage());
        }
    }


//
//    @GetMapping("/{idStage}/download")
//    @PreAuthorize("hasRole('ENCADRANT') or hasRole('ETUDIANT')")
//    public ResponseEntity<Resource> downloadRapport(@PathVariable Long idStage) {
//        Rapport rapport = rapportRepository.findByStageId(idStage)
//                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé"));
//
//        // Nouvelle approche : décoder l'URL si elle est en base64
//        String decodedUrl = decodeCloudinaryUrl(rapport.getCloudinaryUrl());
//
//        RestTemplate restTemplate = new RestTemplate();
//        ResponseEntity<byte[]> response = restTemplate.exchange(
//                decodedUrl,
//                HttpMethod.GET,
//                null,
//                byte[].class
//        );
//
//        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
//            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
//        }
//
//        ByteArrayResource resource = new ByteArrayResource(response.getBody());
//
//        // Générer un nom de fichier valide avec extension .pdf
//        String fileName = rapport.getNomFichier();
//        if (fileName == null || fileName.isEmpty()) {
//            fileName = "rapport_stage";
//        }
//
//        // Supprimer l'extension existante si présente
//        fileName = fileName.replaceAll("\\.(pdf|docx?|txt)$", "");
//
//        // Ajouter systématiquement l'extension .pdf
//        fileName += ".pdf";
//
//        // Nettoyer le nom de fichier
//        fileName = fileName.replaceAll("[^a-zA-Z0-9._-]", "_");
//
//        return ResponseEntity.ok()
//                .header(HttpHeaders.CONTENT_DISPOSITION,
//                        "attachment; filename=\"" + fileName + "\"")
//                .contentType(MediaType.APPLICATION_PDF)
//                .contentLength(response.getBody().length)
//                .body(resource);
//    }
//
//    private String decodeCloudinaryUrl(String url) {
//        if (url.startsWith("data:application/pdf;base64,")) {
//            String base64Data = url.substring(url.indexOf(",") + 1);
//            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
//            return new String(decodedBytes, StandardCharsets.UTF_8);
//        }
//        return url;
//    }



    @GetMapping("/{idStage}/download")
    @PreAuthorize("hasRole('ENCADRANT') or hasRole('ETUDIANT')")
    public ResponseEntity<Resource> downloadRapport(@PathVariable Long idStage) {
        // 1. Load the Rapport and its Stage → Etudiant
        Rapport rapport = rapportRepository.findByStageId(idStage)
                .orElseThrow(() -> new ResourceNotFoundException("Rapport non trouvé"));

        Etudiant etu = rapport.getStage().getEtudiant();
        String studentName = (etu.getNom() + "_" + etu.getPrenom())
                .replaceAll("[^a-zA-Z0-9_]", "_");

        // 2. Decode URL if base64-encoded, otherwise use as-is
        String decodedUrl = decodeCloudinaryUrl(rapport.getCloudinaryUrl());

        // 3. Fetch the file bytes from Cloudinary (or wherever)
        RestTemplate rest = new RestTemplate();
        ResponseEntity<byte[]> response = rest.exchange(
                decodedUrl, HttpMethod.GET, null, byte[].class
        );
        if (response.getStatusCode() != HttpStatus.OK || response.getBody() == null) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }

        ByteArrayResource resource = new ByteArrayResource(response.getBody());

        // 4. Build the download filename
        String baseName = "Rapport_" + studentName;
        String filename = baseName + ".pdf";

        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + filename + "\"")
                .contentType(MediaType.APPLICATION_PDF)
                .contentLength(response.getBody().length)
                .body(resource);
    }

    // unchanged helper
    private String decodeCloudinaryUrl(String url) {
        if (url.startsWith("data:application/pdf;base64,")) {
            String base64Data = url.substring(url.indexOf(",") + 1);
            byte[] decodedBytes = Base64.getDecoder().decode(base64Data);
            return new String(decodedBytes, StandardCharsets.UTF_8);
        }
        return url;
    }

    @GetMapping("/{idStage}/url")
    @PreAuthorize("hasRole('ENCADRANT') or hasRole('ETUDIANT')")
    public ResponseEntity<String> getRapportUrl(@PathVariable Long idStage) {
        String url = stageService.getRapportUrlByStage(idStage);
        if (url == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(url);
    }

    @GetMapping("/encadrant/{encadrantId}")
    // @PreAuthorize("hasRole('ENCADRANT')")
    public ResponseEntity<List<RapportDetailsDto>> listRapports(
            @PathVariable Long encadrantId,
            @RequestParam(required = false) Long departementId,
            @RequestParam(required = false) Long classeGroupeId,
            @RequestParam(required = false) Long anneeScolaireId
    ) {
        List<RapportDetailsDto> dtos = rapportService.getRapportsByEncadrant(
                encadrantId, departementId, classeGroupeId, anneeScolaireId
        );
        return ResponseEntity.ok(dtos);
    }

}
