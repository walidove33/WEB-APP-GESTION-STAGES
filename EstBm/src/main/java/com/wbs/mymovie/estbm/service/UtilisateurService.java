package com.wbs.mymovie.estbm.service;

import com.wbs.mymovie.estbm.dto.RegisterRequest;
import com.wbs.mymovie.estbm.dto.UpdateProfileDto;
import com.wbs.mymovie.estbm.model.Encadrant;
import com.wbs.mymovie.estbm.model.Utilisateur;
import com.wbs.mymovie.estbm.model.enums.Role;
import com.wbs.mymovie.estbm.repository.EncadrantRepository;
import com.wbs.mymovie.estbm.repository.UtilisateurRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;
import java.util.UUID;

@Service
public class UtilisateurService implements UserDetailsService {


    private final UtilisateurRepository utilisateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final EncadrantRepository encadrantRepository;

    @Autowired
    public UtilisateurService(UtilisateurRepository utilisateurRepository,
                              PasswordEncoder passwordEncoder , EncadrantRepository encadrantRepository) {
        this.utilisateurRepository = utilisateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.encadrantRepository = encadrantRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Utilisateur utilisateur = utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        return new org.springframework.security.core.userdetails.User(
                utilisateur.getEmail(),
                utilisateur.getPassword(),
                List.of(new SimpleGrantedAuthority("ROLE_" + utilisateur.getRole().name()))
        );
    }



    public Utilisateur updateProfile(Long userId, UpdateProfileDto dto) {
        Utilisateur utilisateur = utilisateurRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("Utilisateur non trouvé"));

        utilisateur.setNom(dto.getNom());
        utilisateur.setPrenom(dto.getPrenom());
        utilisateur.setEmail(dto.getEmail());
        utilisateur.setTelephone(dto.getTelephone());
        return utilisateurRepository.save(utilisateur);
    }


    public Utilisateur enregistrer(Utilisateur utilisateur) {
        utilisateur.setPassword(passwordEncoder.encode(utilisateur.getPassword())); // 👈 hachage
        return utilisateurRepository.save(utilisateur);
    }


    public boolean emailExiste(String email) {
        return utilisateurRepository.findByEmail(email).isPresent();
    }


        public Utilisateur findByEmail(String   email) {
            return utilisateurRepository.findByEmail(email).orElse(null);
    }


    public Utilisateur creerCompteEncadrant(RegisterRequest req) {
        if (emailExiste(req.getEmail())) {
            throw new IllegalArgumentException("Email déjà utilisé");
        }

        Utilisateur encadrant = new Utilisateur();
        encadrant.setEmail(req.getEmail());
        encadrant.setPassword(passwordEncoder.encode(req.getPassword()));
        encadrant.setRole(Role.ENCADRANT);
        return utilisateurRepository.save(encadrant);
    }

    // UtilisateurService.java
    public List<Encadrant> getEncadrants() {
        return encadrantRepository.findAll();
    }

    public List<Utilisateur> getAllUsers() {
        return utilisateurRepository.findAll();
    }

    public List<Utilisateur> getByRole(Role role) {
        return utilisateurRepository.findByRole(role);
    }

}
