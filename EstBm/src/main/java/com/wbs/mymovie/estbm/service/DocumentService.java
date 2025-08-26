package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.model.Document;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.repository.DocumentRepository;
import com.wbs.mymovie.estbm.repository.EtudiantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class DocumentService {

    private final DocumentRepository documentRepository;
    private final EtudiantRepository etudiantRepository;

    @Autowired
    public DocumentService(DocumentRepository documentRepository,
                           EtudiantRepository etudiantRepository) {
        this.documentRepository = documentRepository;
        this.etudiantRepository = etudiantRepository;
    }

    public List<Document> getDocumentsByStudentEmail(String email) {
        Etudiant etudiant = etudiantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        return documentRepository.findByEtudiantId(etudiant.getId());
    }

    public Document getDocumentById(Long id) {
        return documentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Document non trouvé"));
    }

    public Document uploadDocument(MultipartFile file, Long etudiantId, String type) throws IOException {
        Etudiant etudiant = etudiantRepository.findById(etudiantId)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        // Créer le dossier s'il n'existe pas
        Path uploadPath = Paths.get("uploads/documents");
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Générer un nom de fichier unique
        String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path filePath = uploadPath.resolve(fileName);
        Files.copy(file.getInputStream(), filePath);

        // Créer et sauvegarder le document
        Document document = new Document();
        document.setNom(file.getOriginalFilename());
        document.setType(type);
        document.setCheminFichier(filePath.toString());
        document.setEtudiant(etudiant);

        return documentRepository.save(document);
    }
}