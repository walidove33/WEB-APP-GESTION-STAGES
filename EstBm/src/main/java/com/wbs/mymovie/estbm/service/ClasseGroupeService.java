package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.ClasseGroupeDto;
import com.wbs.mymovie.estbm.model.ClasseGroupe;
import com.wbs.mymovie.estbm.repository.ClasseGroupeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClasseGroupeService {
    @Autowired
    private ClasseGroupeRepository repo;
    public ClasseGroupeDto create(String nom) {
        ClasseGroupe c = new ClasseGroupe(); c.setNom(nom);
        c = repo.save(c);
        return new ClasseGroupeDto(c.getId(), c.getNom());
    }
    public List<ClasseGroupeDto> list() {
        return repo.findAll().stream()
                .map(c -> new ClasseGroupeDto(c.getId(), c.getNom()))
                .collect(Collectors.toList());
    }
}