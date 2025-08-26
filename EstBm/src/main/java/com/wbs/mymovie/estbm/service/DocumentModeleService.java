package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.model.DocumentModele;
import com.wbs.mymovie.estbm.repository.DocumentModeleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class DocumentModeleService {
    @Autowired
    private DocumentModeleRepository docRepo;

    public Optional<DocumentModele> getParType(String type) {
        return docRepo.findByType(type);
    }
}