package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.*;
import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.model.enums.EtatStage;
import com.wbs.mymovie.estbm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.*;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.itextpdf.text.DocumentException;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;

import java.io.IOException;
import java.nio.file.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StageService {

    @Autowired
    private StageRepository stageRepository;
    @Autowired
    private EtudiantRepository etudiantRepository;
    @Autowired
    private EncadrantRepository encadrantRepository;
    @Autowired
    private RapportRepository rapportRepository;
    @Autowired
    private DocumentModeleRepository documentModeleRepository;
    @Autowired
    private DocumentRepository documentRepository;
    @Autowired
    private ConventionGeneratorService conventionGeneratorService;


    @Autowired
    private Cloudinary cloudinary;

    @Value("${upload.directory}")
    private String uploadDir;

    public Stage creerDemande(DemandeStageDto dto) {
        Etudiant etu = etudiantRepository.findById(dto.getIdEtudiant())
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));
        Stage s = new Stage();
        s.setSujet(dto.getSujet());
        s.setEntreprise(dto.getEntreprise());
        s.setAdresseEntreprise(dto.getAdresseEntreprise());
        s.setTelephoneEntreprise(dto.getTelephoneEntreprise());
        s.setRepresentantEntreprise(dto.getRepresentantEntreprise());
        s.setFiliere(dto.getFiliere());
        s.setDateDebut(dto.getDateDebut());
        s.setDateFin(dto.getDateFin());
        s.setEtat(EtatStage.EN_ATTENTE_VALIDATION);
        s.setEtudiant(etu);
        if (etu.getEncadrant() != null) {
            s.setEncadrant(etu.getEncadrant());
        }
        s.setDateCreation(LocalDateTime.now());
        return stageRepository.save(s);
    }

    public List<Stage> getStagesParEtudiant(Long idEtudiant) {
        return stageRepository.findByEtudiantId(idEtudiant);
    }


    public List<StageDto> getStagesDtoParEtudiant(Long idEtudiant) {
        return stageRepository.findDtosByEtudiantId(idEtudiant);
    }


    public List<Stage> getStagesParEncadrant(Long idEncadrant) {
        return stageRepository.findByEncadrantId(idEncadrant);
    }

    public String etatDemande(Long idEtudiant) {
        Optional<Stage> stageOpt = stageRepository.findTopByEtudiantIdOrderByDateCreationDesc(idEtudiant);
        return stageOpt.map(stage -> stage.getEtat().name()).orElse("Aucune demande");
    }


//
//    @Async
//    public String soumettreRapport(Long idStage, MultipartFile file) {
//        try {
//            // 1) Validation
//            if (file.isEmpty()) {
//                throw new IllegalArgumentException("Fichier vide");
//            }
//            if (!"application/pdf".equals(file.getContentType())) {
//                throw new IllegalArgumentException("Seuls les PDF sont acceptés");
//            }
//
//            // 2) Récupérer le stage
//            Stage stage = stageRepository.findById(idStage)
//                    .orElseThrow(() -> new RuntimeException("Stage introuvable"));
//
//            // 3) Rechercher un rapport existant
//            Optional<Rapport> optOld = rapportRepository.findByStageId(idStage);
//            Rapport rapport;
//            if (optOld.isPresent()) {
//                // a) détruire l'ancien sur Cloudinary
//                Rapport old = optOld.get();
//                cloudinary.uploader().destroy(old.getPublicId(), ObjectUtils.emptyMap());
//                // b) réutiliser l'entité
//                rapport = old;
//            } else {
//                // pas de rapport existant : on crée une nouvelle instance
//                rapport = new Rapport();
//                rapport.setStage(stage);
//            }
//
//            // 4) Configuration d'upload optimisée pour les PDF
//            Map<String, Object> uploadParams = ObjectUtils.asMap(
//                    "resource_type", "raw",       // Type explicite pour les fichiers bruts
//                    "folder", "rapports/stages/",
//                    "public_id", "rapport_" + stage.getId() + "_" + System.currentTimeMillis(),
//                    "use_filename", false,
//                    "unique_filename", true,
//                    "overwrite", false,
//                    "invalidate", true,
//                    "quality", "auto:best",
//                    "type", "upload",
//                    "access_mode", "public",      // Accès public
//                    "allowed_formats", "pdf",     // Format explicitement autorisé
//                    "format", "pdf"               // Force le format de sortie
//            );
//
//
//            // 5) Upload vers Cloudinary
//            @SuppressWarnings("unchecked")
//            Map<String, Object> uploadResult = cloudinary.uploader().upload(
//                    file.getBytes(),
//                    uploadParams
//            );
//
//            // 6) Mettre à jour l'entité avec les nouvelles informations
//            rapport.setNomFichier(file.getOriginalFilename());
//            rapport.setCloudinaryUrl((String) uploadResult.get("secure_url"));
//            rapport.setPublicId((String) uploadResult.get("public_id"));
//            rapport.setDateDepot(LocalDate.now());
//
//            // 7) Sauvegarder en base
//            rapportRepository.save(rapport);
//
//            // 8) Mettre à jour l'état du stage
//            stage.setEtat(EtatStage.RAPPORT_SOUMIS);
//            stageRepository.save(stage);
//
//            return "Rapport soumis avec succès";
//
//        } catch (IOException e) {
//            throw new RuntimeException("Erreur lors de l'upload: " + e.getMessage(), e);
//        }
//    }

    @Async
    public String soumettreRapport(Long idStage, MultipartFile file) {
        try {
            // 1) Validation
            if (file.isEmpty()) {
                throw new IllegalArgumentException("Fichier vide");
            }
            if (!"application/pdf".equals(file.getContentType())) {
                throw new IllegalArgumentException("Seuls les PDF sont acceptés");
            }

            // 2) Récupérer le stage (et via lui l'étudiant)
            Stage stage = stageRepository.findById(idStage)
                    .orElseThrow(() -> new RuntimeException("Stage introuvable"));
            Etudiant etu = stage.getEtudiant();
            if (etu == null) {
                throw new RuntimeException("Aucun étudiant rattaché à ce stage");
            }

            // 3) Rechercher un rapport existant
            Optional<Rapport> optOld = rapportRepository.findByStageId(idStage);
            Rapport rapport;
            if (optOld.isPresent()) {
                // a) détruire l'ancien sur Cloudinary
                Rapport old = optOld.get();
                cloudinary.uploader().destroy(old.getPublicId(), ObjectUtils.emptyMap());
                // b) réutiliser l'entité
                rapport = old;
            } else {
                // pas de rapport existant : on crée une nouvelle instance
                rapport = new Rapport();
                rapport.setStage(stage);
            }

            // 4) Configuration d'upload optimisée pour les PDF
            Map<String, Object> uploadParams = ObjectUtils.asMap(
                    "resource_type", "raw",
                    "folder", "rapports/stages/",
                    "public_id", "rapport_" + stage.getId() + "_" + System.currentTimeMillis(),
                    "use_filename", false,
                    "unique_filename", true,
                    "overwrite", false,
                    "invalidate", true,
                    "quality", "auto:best",
                    "type", "upload",
                    "access_mode", "public",
                    "allowed_formats", "pdf",
                    "format", "pdf"
            );

            // 5) Upload vers Cloudinary
            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    uploadParams
            );

            // 6) Mettre à jour l'entité avec les nouvelles informations
            rapport.setNomFichier(file.getOriginalFilename());
            rapport.setCloudinaryUrl((String) uploadResult.get("secure_url"));
            rapport.setPublicId((String) uploadResult.get("public_id"));
            rapport.setDateDepot(LocalDate.now());

            // 6bis) Peupler les relations pour qu'elles soient persistées
            rapport.setEtudiant(etu);
            rapport.setDepartement(etu.getDepartement());
            rapport.setClasseGroupe(etu.getClasseGroupe());
            rapport.setAnneeScolaire(etu.getAnneeScolaire());

            // 7) Sauvegarder en base
            rapportRepository.save(rapport);

            // 8) Mettre à jour l'état du stage
            stage.setEtat(EtatStage.RAPPORT_SOUMIS);
            stageRepository.save(stage);

            return "Rapport soumis avec succès";

        } catch (IOException e) {
            throw new RuntimeException("Erreur lors de l'upload: " + e.getMessage(), e);
        }
    }



    public ResponseEntity<Resource> genererEtTelechargerConvention(Long idStage) {
        Stage stage = stageRepository.findById(idStage)
                .orElseThrow(() -> new RuntimeException("Stage non trouvé"));

        try {
            byte[] pdfContent = conventionGeneratorService.generateConventionPdf(stage);
            ByteArrayResource resource = new ByteArrayResource(pdfContent);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=convention_" + idStage + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(resource);

        } catch (DocumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ByteArrayResource("Erreur de génération PDF".getBytes()));
        }
    }


    public ResponseEntity<?> exporterListes(String format) {
        // Implémentation réelle à compléter
        String data = "Export " + format;
        ByteArrayResource res = new ByteArrayResource(data.getBytes());
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=list." + format)
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .body(res);
    }

    public ResponseEntity<?> genererConventionAuto(Long idStage) {
        return genererEtTelechargerConvention(idStage);
    }

    public ResponseEntity<?> assignerEncadrant(Long idStage, Long idEncadrant) {
        Stage s = stageRepository.findById(idStage)
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));
        Encadrant e = encadrantRepository.findById(idEncadrant)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));
        s.setEncadrant(e);
        stageRepository.save(s);
        return ResponseEntity.ok("Encadrant assigné");
    }

    public ResponseEntity<?> attribuerDocument(Long idStage, MultipartFile file, String type) {
        try {
            Stage stage = stageRepository.findById(idStage)
                    .orElseThrow(() -> new RuntimeException("Stage introuvable"));

            Path uploadPath = Paths.get(uploadDir);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = type + "_" + idStage + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            Document document = new Document();
            document.setNom(file.getOriginalFilename());
            document.setType(type);
            document.setCheminFichier(filePath.toString());
            document.setStage(stage);
            document.setEtudiant(stage.getEtudiant());
            documentRepository.save(document);

            return ResponseEntity.ok(type + " attribué au stage " + idStage);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'upload du fichier");
        }
    }

//    public String approuverOuRefuser(DecisionDto dto) {
//        Stage s = stageRepository.findById(dto.getIdStage())
//                .orElseThrow(() -> new RuntimeException("Stage introuvable"));
//        s.setEtat(dto.isApprouver() ? EtatStage.ACCEPTE : EtatStage.REFUSE);
//        stageRepository.save(s);
//        return "Décision enregistrée";
//    }


    public Map<String, String> approuverOuRefuser(DecisionDto dto) {
        Stage s = stageRepository.findById(dto.getIdStage())
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));

        s.setEtat(dto.isApprouver() ? EtatStage.ACCEPTE : EtatStage.REFUSE);
        stageRepository.save(s);

        // Renvoyer un objet JSON
        Map<String, String> response = new HashMap<>();
        response.put("message", "Décision enregistrée");
        return response;
    }

    public String ajouterNote(NoteDto dto) {
        Stage s = stageRepository.findById(dto.getIdStage())
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));
        s.setNote(dto.getCommentaire());
        stageRepository.save(s);
        return "Commentaire ajouté";
    }

    public List<Stage> listerDemandesPourEncadrant(String filiere) {
        EtatStage filtre = EtatStage.EN_ATTENTE_VALIDATION;  // ou DEMANDE
        if (filiere == null) {
            return stageRepository.findByEtat(filtre);
        }
        return stageRepository.findByFiliereAndEtat(filiere, filtre);
    }

//    public ResponseEntity<?> assignerEncadrantAEtudiant(AssignmentDto dto) {
//        Etudiant etu = etudiantRepository.findById(dto.getIdEtudiant())
//                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));
//        Encadrant enc = encadrantRepository.findById(dto.getIdEncadrant())
//                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));
//        etu.setEncadrant(enc);
//        etudiantRepository.save(etu);
//        return ResponseEntity.ok("Encadrant affecté à l'étudiant");
//    }

    // Nouvelle méthode pour récupérer les documents d'un stage
    public List<Document> getDocumentsByStageId(Long stageId) {
        return documentRepository.findByStageId(stageId);
    }

    public void ajouterDocuments(Long stageId,
                                 List<MultipartFile> fichiers,
                                 List<String> types) throws IOException {
        Stage stage = stageRepository.findById(stageId)
                .orElseThrow(() -> new RuntimeException("Stage non trouvé avec ID: " + stageId));

        // Créer le dossier uploads/stages/{stageId}
        Path uploadDir = Paths.get("uploads/stages/" + stageId);
        if (!Files.exists(uploadDir)) {
            Files.createDirectories(uploadDir);
        }

        // Boucle sur chaque fichier + son type
        for (int i = 0; i < fichiers.size(); i++) {
            MultipartFile fichier = fichiers.get(i);
            String type = types.get(i);

            if (fichier == null || fichier.isEmpty()) continue;

            String nomFichier = System.currentTimeMillis() + "_" + fichier.getOriginalFilename();
            Path cible = uploadDir.resolve(nomFichier);
            Files.copy(fichier.getInputStream(), cible, StandardCopyOption.REPLACE_EXISTING);

            Document doc = new Document();
            doc.setNom(fichier.getOriginalFilename());
            doc.setType(type);
            doc.setCheminFichier(cible.toString());
            doc.setStage(stage);
            // (optionnel) doc.setEtudiant(stage.getEtudiant());
            documentRepository.save(doc);
        }
    }


    // StageService.java
    public ResponseEntity<?> assignerEncadrantAEtudiant(AssignmentDto dto) {
        Etudiant etudiant = etudiantRepository.findById(dto.getEtudiantId())
                .orElseThrow(() -> new RuntimeException("Étudiant introuvable"));

        Encadrant encadrant = encadrantRepository.findById(dto.getEncadrantId())
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));

        etudiant.setEncadrant(encadrant);
        etudiantRepository.save(etudiant);

        // Créer un objet de réponse avec les noms
        Map<String, String> response = new HashMap<>();
        response.put("message", "Encadrant affecté à l'étudiant avec succès");
        response.put("etudiant", etudiant.getPrenom() + " " + etudiant.getNom());
        response.put("encadrant", encadrant.getPrenom() + " " + encadrant.getNom());

        return ResponseEntity.ok(response);
    }




    @Cacheable("stageStats")
    public Map<String, Object> getStatistiques() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("total", stageRepository.count());
        stats.put("enAttente", stageRepository.countByEtat(EtatStage.DEMANDE));

        // Compter ACCEPTE + RAPPORT_SOUMIS comme "validés"
        long valides = stageRepository.countByEtat(EtatStage.ACCEPTE)
                + stageRepository.countByEtat(EtatStage.RAPPORT_SOUMIS);
        stats.put("valides", valides);

        stats.put("refuses", stageRepository.countByEtat(EtatStage.REFUSE));
        stats.put("enCours", stageRepository.countByEtat(EtatStage.EN_COURS));
        stats.put("rapportsSoumis", stageRepository.countByEtat(EtatStage.RAPPORT_SOUMIS));
        stats.put("totalEtudiants", etudiantRepository.count());
        stats.put("totalEncadrants", encadrantRepository.count());

        return stats;
    }

    public List<Stage> getAllStages() {
        return stageRepository.findAll();
    }


    public List<AssignmentDto> getAssignments() {
        return etudiantRepository.findByEncadrantIsNotNull().stream()
                .map(etudiant -> {
                    AssignmentDto dto = new AssignmentDto();
                    dto.setEtudiantId(etudiant.getId());
                    dto.setEtudiantNom(etudiant.getNom() + " " + etudiant.getPrenom());
                    dto.setEncadrantId(etudiant.getEncadrant().getId());
                    dto.setEncadrantNom(etudiant.getEncadrant().getNom() + " " + etudiant.getEncadrant().getPrenom());
                    return dto;
                })
                .collect(Collectors.toList());
    }

    public List<Stage> getDemandesParEncadrant(Long idEncadrant) {
        List<EtatStage> etats = Arrays.asList(
                EtatStage.DEMANDE,
                EtatStage.EN_ATTENTE_VALIDATION,
                EtatStage.VALIDATION_EN_COURS
        );
        return stageRepository.findByEncadrantIdAndEtatIn(idEncadrant, etats);
    }




    public RapportDto getExistingRapportDto(Long stageId) {
        return rapportRepository.findDtoByStageId(stageId)
                .orElse(null);
    }


    // Expose les DTO pour un encadrant
    public List<StageDto> getStagesDtoParEncadrant(Long idEncadrant) {
        return stageRepository.findDtosByEncadrantId(idEncadrant);
    }



    public Rapport getRapportEntityByStage(Long idStage) {
        return rapportRepository.findByStageId(idStage)
                .orElseThrow(() -> new RuntimeException("Rapport introuvable pour le stage " + idStage));
    }


    public String getRapportUrlByStage(Long stageId) {
        return rapportRepository
                .findCloudinaryUrlByStageId(stageId)
                .orElse(null);
    }



    public List<StageDto> findAllDtos() {
        return stageRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    private StageDto toDto(Stage s) {
        StageDto dto = new StageDto();
        dto.setId(s.getId());
        dto.setSujet(s.getSujet());
        // … copy all simple fields …
        dto.setEntreprise(s.getEntreprise());
        dto.setAdresseEntreprise(s.getAdresseEntreprise());
        dto.setTelephoneEntreprise(s.getTelephoneEntreprise());
        dto.setRepresentantEntreprise(s.getRepresentantEntreprise());
        dto.setFiliere(s.getFiliere());
        dto.setDateDebut(s.getDateDebut());
        dto.setDateFin(s.getDateFin());
        dto.setEtat(s.getEtat());

        dto.setDateCreation(s.getDateCreation());

        if (s.getRapport() != null) {
            Rapport r = s.getRapport();
            RapportDto rd = new RapportDto(
                    r.getId(),
                    r.getNomFichier(),
                    r.getDateDepot(),           // LocalDate
                    r.getStage().getId(),       // Long stageId
                    r.getCloudinaryUrl()        // String cloudinaryUrl
            );
            dto.setRapport(rd);
        }

        return dto;
    }




}