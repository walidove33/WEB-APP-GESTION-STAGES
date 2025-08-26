package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.model.Document;
import com.wbs.mymovie.estbm.model.Encadrant;
import com.wbs.mymovie.estbm.repository.DocumentRepository;
import com.wbs.mymovie.estbm.repository.EncadrantRepository;
import com.wbs.mymovie.estbm.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@RestController
@RequestMapping("/stages/documents")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private EncadrantRepository encadrantRepository;

    // Admin upload un document pour un étudiant
    @PostMapping("/admin/upload")
    public ResponseEntity<Document> uploadDocument(
            @RequestParam Long etudiantId,
            @RequestParam String type,
            @RequestParam("file") MultipartFile file) {
        try {
            Document doc = documentService.uploadDocument(file, etudiantId, type);
            return ResponseEntity.ok(doc);
        } catch (IOException e) {
            return ResponseEntity.status(500).build();
        }
    }

    // Étudiant récupère ses documents
    @GetMapping("/etudiant/mes-documents")
    public ResponseEntity<List<Document>> getMesDocuments(Authentication authentication) {
        String email = authentication.getName();
        List<Document> documents = documentService.getDocumentsByStudentEmail(email);
        return ResponseEntity.ok(documents);
    }

    // Télécharger un document
    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadDocument(@PathVariable Long id) {
        Document document = documentService.getDocumentById(id);
        try {
            Path filePath = Paths.get(document.getCheminFichier());
            Resource resource = new UrlResource(filePath.toUri());

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=\"" + document.getNom() + "\"")
                    .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }


    // DocumentController.java
    @GetMapping("/encadrant/mes-documents")
    public ResponseEntity<List<Document>> getMesDocumentsEncadrant(Authentication authentication) {
        String email = authentication.getName();
        Encadrant encadrant = encadrantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Encadrant non trouvé"));

        List<Document> documents = documentRepository.findByEncadrantId(encadrant.getId());
        return ResponseEntity.ok(documents);
    }
}