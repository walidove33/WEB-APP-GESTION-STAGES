package com.wbs.mymovie.estbm.controller;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nimbusds.jose.util.Resource;
import com.wbs.mymovie.estbm.dto.*;

import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.repository.EncadrantRepository;
import com.wbs.mymovie.estbm.repository.RapportRepository;
import com.wbs.mymovie.estbm.service.CommentaireRapportService;
import com.wbs.mymovie.estbm.service.EncadrantService;
import com.wbs.mymovie.estbm.service.StageService;
import com.wbs.mymovie.estbm.service.UtilisateurService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stages/encadrants")
public class EncadrantController {

    @Autowired
    private EncadrantService encadrantService;

    @Autowired
    private StageService stageService;

    @Autowired
    private EncadrantRepository encadrantRepository;

    @Autowired
    private RapportRepository rapportRepository;

    @Autowired private CommentaireRapportService service;
    @Autowired private UtilisateurService utilisateurService;

    @Autowired
    private Cloudinary cloudinary;

    @GetMapping("/{id}/stages")
    public ResponseEntity<List<Stage>> getStagesByEncadrant(@PathVariable Long id) {
        return ResponseEntity.ok(stageService.getStagesParEncadrant(id));
    }

    @PutMapping("/{idEncadrant}/stage/{idStage}/valider")
    public ResponseEntity<?> validerStage(@PathVariable Long idEncadrant, @PathVariable Long idStage) {
        boolean success = encadrantService.validerStage(idEncadrant, idStage);
        return success ? ResponseEntity.ok("Stage validé") : ResponseEntity.badRequest().body("Erreur de validation");
    }

    @PutMapping("/{idEncadrant}/stage/{idStage}/refuser")
    public ResponseEntity<?> refuserStage(@PathVariable Long idEncadrant, @PathVariable Long idStage) {
        boolean success = encadrantService.refuserStage(idEncadrant, idStage);
        return success ? ResponseEntity.ok("Stage refusé") : ResponseEntity.badRequest().body("Erreur de refus");
    }

    @PutMapping("/{idEncadrant}/stage/{idStage}/note")
    public ResponseEntity<?> noterStage(@PathVariable Long idEncadrant,
                                        @PathVariable Long idStage,
                                        @RequestParam String commentaire) {
        boolean success = encadrantService.attribuerNote(idEncadrant, idStage, commentaire);
        return success ? ResponseEntity.ok("Commentaire enregistré")
                : ResponseEntity.badRequest().body("Erreur lors de l'ajout du commentaire");
    }

    @GetMapping("/demandes")
    public ResponseEntity<?> listerDemandes(@RequestParam(required = false) String filiere) {
        return ResponseEntity.ok(stageService.listerDemandesPourEncadrant(filiere));
    }

//    @PostMapping("/decision")
//    public ResponseEntity<?> decisionDemande(@RequestBody DecisionDto dto) {
//        return ResponseEntity.ok(stageService.approuverOuRefuser(dto));
//    }

    @PostMapping("/decision")
    public ResponseEntity<?> decisionDemande(@RequestBody DecisionDto dto) {
        String result = stageService.approuverOuRefuser(dto).toString();

        // Renvoyer un objet JSON au lieu de texte brut
        Map<String, String> response = new HashMap<>();
        response.put("message", result);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/note")
    public ResponseEntity<?> noter(@RequestBody NoteDto dto) {
        return ResponseEntity.ok(stageService.ajouterNote(dto));
    }



//    @GetMapping("/me/rapports")
//    public ResponseEntity<List<RapportDto>> getMyRapports(Authentication authentication) {
//        String email = authentication.getName();
//
//        // Récupérer l'encadrant connecté
//        Encadrant encadrant = encadrantRepository.findByEmail(email)
//                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));
//
//        // Récupérer les rapports associés à ses stages
//        List<Rapport> rapports = rapportRepository.findByEncadrantId(encadrant.getId());
//
//        // Mapper vers des DTOs sans les données binaires
//        List<RapportDto> dtoList = rapports.stream()
//                .map(r -> new RapportDto(
//                        r.getId(),
//                        r.getNomFichier(),
//                        r.getDateDepot() != null ? r.getDateDepot().toString() : null // éviter les NPE
//                ))
//                .toList();
//
//        return ResponseEntity.ok(dtoList);
//    }



    @GetMapping("/me/rapports")
    public ResponseEntity<List<RapportDto>> getMyRapports(Authentication auth) {
        // Récupérer l'encadrant connecté
        Encadrant enc = encadrantRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));

        // Appeler **uniquement** la projection DTO
        List<RapportDto> dtos = rapportRepository.findDtoByEncadrantId(enc.getId());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/me/rapports/details")
    public ResponseEntity<List<RapportDetailsDto>> getMyRapportsDetails(Authentication auth) {
        Encadrant enc = encadrantRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));

        // appel de la méthode JPQL détaillée, sans filtres (tous null)
        List<RapportDetailsDto> dtos = rapportRepository
                .findDetailsByEncadrantAndFilters(
                        enc.getId(),
                        null,  // departementId
                        null,  // classeGroupeId
                        null   // anneeScolaireId
                );

        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/me/demandes")
    public ResponseEntity<List<Stage>> getMesDemandes(Authentication authentication) {
        String email = authentication.getName();
        Encadrant enc = encadrantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));
        List<Stage> demandes = stageService.getDemandesParEncadrant(enc.getId());
        return ResponseEntity.ok(demandes);
    }


    @GetMapping("/{idStage}/url")
    public ResponseEntity<String> getRapportUrl(@PathVariable Long idStage) {
        String url = stageService.getRapportUrlByStage(idStage);
        if (url == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(url);
    }


    @GetMapping("/me/stages")
    public ResponseEntity<List<StageDto>> getMyStages(Authentication authentication) {
        String email = authentication.getName();
        Encadrant encadrant = encadrantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));

        List<StageDto> dtos = stageService.getStagesDtoParEncadrant(encadrant.getId());
        return ResponseEntity.ok(dtos);
    }


    @GetMapping("/me/commentaires")
    public ResponseEntity<List<CommentaireRapport>> listComments(
            Authentication auth,
            @RequestParam(required = false) String etudiant) {

        String email = auth.getName();
        Utilisateur user = utilisateurService.findByEmail(email);
        Encadrant enc = encadrantRepository.findByUtilisateur(user)
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));
        List<CommentaireRapport> comments = service.listComments(enc.getId(), etudiant);
        return ResponseEntity.ok(comments);
    }

    @PostMapping("/{rapportId}/commentaire")
    public ResponseEntity<CommentaireRapport> addComment(
            Authentication auth,
            @PathVariable Long rapportId,
            @RequestBody Map<String, String> body) {

        String email = auth.getName();
        Utilisateur user = utilisateurService.findByEmail(email);
        Encadrant enc = encadrantRepository.findByUtilisateur(user)
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));

        String texte = body.get("texte");
        CommentaireRapport c = service.addComment(rapportId, enc.getId(), texte);
        return ResponseEntity.ok(c);
    }




    

}
