package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.dto.*;
import com.wbs.mymovie.estbm.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DepartementService {
    @Autowired private DepartementRepository repo;
    public DepartementDto create(String nom) {
        Departement d = new Departement(); d.setNom(nom);
        d = repo.save(d);
        return new DepartementDto(d.getId(), d.getNom());
    }
    public List<DepartementDto> list() {
        return repo.findAll().stream()
                .map(d -> new DepartementDto(d.getId(), d.getNom()))
                .collect(Collectors.toList());
    }
}