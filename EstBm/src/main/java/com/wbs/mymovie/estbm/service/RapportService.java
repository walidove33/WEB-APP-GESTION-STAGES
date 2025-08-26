package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.RapportDetailsDto;
import com.wbs.mymovie.estbm.model.Rapport;
import com.wbs.mymovie.estbm.repository.RapportRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RapportService {
    @Autowired
    private RapportRepository rapportRepository;

    public Rapport enregistrer(Rapport r) {
        return rapportRepository.save(r);
    }



    public List<RapportDetailsDto> getRapportsByEncadrant(
            Long encadrantId,
            Long departementId,
            Long classeGroupeId,
            Long anneeScolaireId
    ) {
        return rapportRepository.findDetailsByEncadrantAndFilters(
                encadrantId, departementId, classeGroupeId, anneeScolaireId
        );
    }
}