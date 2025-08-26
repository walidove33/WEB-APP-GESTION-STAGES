package com.wbs.mymovie.estbm.service;


import com.wbs.mymovie.estbm.dto.*;
import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
public class EtudiantService {


    @Autowired private EtudiantRepository etudiantRepository;


    @Autowired private ClasseGroupeRepository clsRepo;
    @Autowired private AnneeScolaireRepository anRepo;
    @Autowired
    private DepartementRepository departementRepository;

    public Optional<Etudiant> chercherParCodeEtDate(String apogee, String massar, LocalDate naissance) {
        return etudiantRepository.findByCodeApogeeAndCodeMassarAndDateNaissance(apogee, massar, naissance);
    }

    public Etudiant enregistrer(Etudiant e) {
        return etudiantRepository.save(e);
    }

    public Optional<Etudiant> getById(Long id) {
        return etudiantRepository.findById(id);
    }


    public Etudiant updateProfile(Long id, UpdateProfileDto dto) {
        Etudiant etudiant = etudiantRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        etudiant.setNom(dto.getNom());
        etudiant.setPrenom(dto.getPrenom());
        etudiant.setEmail(dto.getEmail());
        etudiant.setTelephone(dto.getTelephone());


        return etudiantRepository.save(etudiant);
    }


    public EtudiantProfileDto getProfile(Long id) {
        Etudiant e = etudiantRepository.findById(id).orElseThrow();
        return map(e);
    }
    private EtudiantProfileDto map(Etudiant e) {
        Departement d = e.getDepartement();
        ClasseGroupe c = e.getClasseGroupe();
        AnneeScolaire a = e.getAnneeScolaire();
        EtudiantProfileDto dto = new EtudiantProfileDto();
        dto.setId(e.getId()); dto.setNom(e.getNom()); dto.setPrenom(e.getPrenom());
        dto.setEmail(e.getEmail()); dto.setTelephone(e.getTelephone());
        dto.setCodeApogee(e.getCodeApogee()); dto.setCodeMassar(e.getCodeMassar());
        dto.setDateNaissance(e.getDateNaissance());
        dto.setDepartement(new DepartementDto(d.getId(), d.getNom()));
        dto.setClasseGroupe(new ClasseGroupeDto(c.getId(), c.getNom()));
        dto.setAnneeScolaire(new AnneeScolaireDto(a.getId(), a.getLibelle()));
        return dto;
    }
    public void assignAttributes(AssignmentDto dto) {
        Etudiant e = etudiantRepository.findById(dto.getEtudiantId()).orElseThrow();
        e.setDepartement(departementRepository.findById(dto.getDepartementId()).orElseThrow());
        e.setClasseGroupe(clsRepo.findById(dto.getClasseGroupeId()).orElseThrow());
        e.setAnneeScolaire(anRepo.findById(dto.getAnneeScolaireId()).orElseThrow());
        etudiantRepository.save(e);
    }
}