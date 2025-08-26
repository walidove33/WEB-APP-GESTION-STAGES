package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.model.CommentaireRapport;
import com.wbs.mymovie.estbm.model.Encadrant;
import com.wbs.mymovie.estbm.model.Rapport;
import com.wbs.mymovie.estbm.repository.CommentaireRapportRepository;
import com.wbs.mymovie.estbm.repository.EncadrantRepository;
import com.wbs.mymovie.estbm.repository.RapportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentaireRapportService {
    @Autowired private CommentaireRapportRepository repo;
    @Autowired
    private RapportRepository rapportRepo;
    @Autowired private EncadrantRepository encRepo;

    public CommentaireRapport addComment(Long rapportId, Long encId, String texte) {
        Rapport r = rapportRepo.findByStageId(rapportId)
                .orElseThrow(() -> new RuntimeException("Rapport introuvable"));
        Encadrant enc = encRepo.findById(encId)
                .orElseThrow(() -> new RuntimeException("Encadrant introuvable"));
        CommentaireRapport c = new CommentaireRapport();
        c.setRapport(r);
        c.setEncadrant(enc);
        c.setTexte(texte);
        return repo.save(c);
    }

    public List<CommentaireRapport> listComments(Long encId, String search) {
        if (search == null || search.isBlank()) {
            return repo.findByRapportStageEncadrantId(encId);
        }
        return repo.findByEncadrantAndEtudiantNameContains(encId, search);
    }
}
