package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.DemandeStageDto;
import com.wbs.mymovie.estbm.dto.RapportDto;
import com.wbs.mymovie.estbm.dto.StageDto;
import com.wbs.mymovie.estbm.dto.UpdateProfileDto;
import com.wbs.mymovie.estbm.model.Document;
import com.wbs.mymovie.estbm.model.Etudiant;
import com.wbs.mymovie.estbm.model.Stage;
import com.wbs.mymovie.estbm.repository.EtudiantRepository;
import com.wbs.mymovie.estbm.repository.StageRepository;
import com.wbs.mymovie.estbm.service.EtudiantService;
import com.wbs.mymovie.estbm.service.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/stages/etudiants")
public class EtudiantController {

    @Autowired
    private EtudiantService etudiantService;

    @Autowired
    private StageService stageService;

    @Autowired
    private EtudiantRepository etudiantRepository ;

    @Autowired
    private StageRepository stageRepository ;



    @GetMapping("/{id}")
    public ResponseEntity<Etudiant> getEtudiant(@PathVariable Long id) {
        return etudiantService.getById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/profile")
    public ResponseEntity<?> updateProfile(@PathVariable Long id, @ModelAttribute UpdateProfileDto dto) {
        Etudiant updated = etudiantService.updateProfile(id, dto);
        return ResponseEntity.ok(updated);
    }




    @GetMapping("/mes-stages")
    public ResponseEntity<List<StageDto>> getMesStages(Authentication authentication) {
        String email = authentication.getName();
        Etudiant etudiant = etudiantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));
        List<StageDto> dtos = stageService.getStagesDtoParEtudiant(etudiant.getId());
        return ResponseEntity.ok(dtos);
    }


    @PostMapping("/demande")
    public ResponseEntity<Stage> creerDemande(@RequestBody DemandeStageDto dto, Authentication authentication) {
        // Récupérer l'étudiant authentifié
        String email = authentication.getName();
        Etudiant etudiant = etudiantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        dto.setIdEtudiant(etudiant.getId());
        return ResponseEntity.ok(stageService.creerDemande(dto));
    }



    @GetMapping("/{stageId}/existing")
    public ResponseEntity<RapportDto> getExistingRapport(@PathVariable Long stageId) {
        RapportDto rapport = stageService.getExistingRapportDto(stageId);
        if (rapport == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(rapport);
    }






    @GetMapping("/rapport/{stageId}")
    public ResponseEntity<RapportDto> getRapportForStage(@PathVariable Long stageId, Authentication authentication) {
        // Vérifier que l'étudiant est propriétaire du stage
        String email = authentication.getName();
        Etudiant etudiant = etudiantRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Étudiant non trouvé"));

        // Vérifier que le stage appartient à l'étudiant
        boolean stageBelongsToStudent = stageRepository.existsByIdAndEtudiantId(stageId, etudiant.getId());
        if (!stageBelongsToStudent) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        RapportDto rapportDto = stageService.getExistingRapportDto(stageId);
        if (rapportDto == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(rapportDto);
    }






}