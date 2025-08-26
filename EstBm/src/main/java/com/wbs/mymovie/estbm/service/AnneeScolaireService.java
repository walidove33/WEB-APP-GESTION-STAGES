package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.AnneeScolaireDto;
import com.wbs.mymovie.estbm.model.AnneeScolaire;
import com.wbs.mymovie.estbm.repository.AnneeScolaireRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AnneeScolaireService {
    @Autowired
    private AnneeScolaireRepository repo;
    public AnneeScolaireDto create(String libelle) {
        AnneeScolaire a = new AnneeScolaire(); a.setLibelle(libelle);
        a = repo.save(a);
        return new AnneeScolaireDto(a.getId(), a.getLibelle());
    }
    public List<AnneeScolaireDto> list() {
        return repo.findAll().stream()
                .map(a -> new AnneeScolaireDto(a.getId(), a.getLibelle()))
                .collect(Collectors.toList());
    }
}

