package com.wbs.mymovie.estbm.controller;


import com.wbs.mymovie.estbm.model.DocumentModele;
import com.wbs.mymovie.estbm.service.DocumentModeleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/stages/documents")
public class DocumentModeleController {

    @Autowired
    private DocumentModeleService documentModeleService;

    @GetMapping("/{type}")
    public ResponseEntity<DocumentModele> getDocByType(@PathVariable String type) {
        return documentModeleService.getParType(type)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}