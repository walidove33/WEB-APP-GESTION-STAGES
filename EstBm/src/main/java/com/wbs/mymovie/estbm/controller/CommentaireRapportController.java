//package com.wbs.mymovie.estbm.controller;
//
//import com.wbs.mymovie.estbm.model.CommentaireRapport;
//import com.wbs.mymovie.estbm.model.Encadrant;
//import com.wbs.mymovie.estbm.model.Utilisateur;
//import com.wbs.mymovie.estbm.repository.EncadrantRepository;
//import com.wbs.mymovie.estbm.service.CommentaireRapportService;
//import com.wbs.mymovie.estbm.service.UtilisateurService;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.security.access.prepost.PreAuthorize;
//import org.springframework.security.core.Authentication;
//import org.springframework.web.bind.annotation.*;
//
//import java.util.List;
//import java.util.Map;
//
//@RestController
//@RequestMapping("/rapports")
//@PreAuthorize("hasRole('ENCADRANT')")
//public class CommentaireRapportController {
//
//    @Autowired private CommentaireRapportService service;
//    @Autowired private UtilisateurService utilisateurService;
//    @Autowired private EncadrantRepository encadrantRepo;
//
//    @GetMapping("/me/commentaires")
//    public ResponseEntity<List<CommentaireRapport>> listComments(
//            Authentication auth,
//            @RequestParam(required = false) String etudiant) {
//
//        String email = auth.getName();
//        Utilisateur user = utilisateurService.findByEmail(email);
//        Encadrant enc = encadrantRepo.findByUtilisateur(user)
//                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));
//        List<CommentaireRapport> comments = service.listComments(enc.getId(), etudiant);
//        return ResponseEntity.ok(comments);
//    }
//
//    @PostMapping("/{rapportId}/commentaire")
//    public ResponseEntity<CommentaireRapport> addComment(
//            Authentication auth,
//            @PathVariable Long rapportId,
//            @RequestBody Map<String, String> body) {
//
//        String email = auth.getName();
//        Utilisateur user = utilisateurService.findByEmail(email);
//        Encadrant enc = encadrantRepo.findByUtilisateur(user)
//                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));
//
//        String texte = body.get("texte");
//        CommentaireRapport c = service.addComment(rapportId, enc.getId(), texte);
//        return ResponseEntity.ok(c);
//    }
//}
