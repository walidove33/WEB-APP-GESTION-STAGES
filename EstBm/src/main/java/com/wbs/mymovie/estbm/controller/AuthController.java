
package com.wbs.mymovie.estbm.controller;

import com.wbs.mymovie.estbm.dto.*;
import com.wbs.mymovie.estbm.model.*;
import com.wbs.mymovie.estbm.model.enums.Role;
import com.wbs.mymovie.estbm.service.*;
import com.wbs.mymovie.estbm.util.JwtUtil;
import io.jsonwebtoken.Claims;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/stages/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private EtudiantService etudiantService;
    @Autowired
    private UtilisateurService utilisateurService;
    @Autowired
    private JwtUtil jwtUtil;



    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        Utilisateur user = utilisateurService.findByEmail(email);
        return ResponseEntity.ok(user);
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication auth = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );

            SecurityContextHolder.getContext().setAuthentication(auth);

            // Generate both tokens
            String token = jwtUtil.generateToken(loginRequest.getEmail());
            String refreshToken = jwtUtil.createRefreshToken(loginRequest.getEmail());

            Utilisateur user = utilisateurService.findByEmail(loginRequest.getEmail());
            return ResponseEntity.ok(new JwtResponse(token, refreshToken, user.getRole().name(), user));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Email ou mot de passe invalide");
        }
    }
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest registerRequest) {
        if (utilisateurService.emailExiste(registerRequest.getEmail())) {
            return ResponseEntity.badRequest().body("Email déjà utilisé");
        }

        var etuOpt = etudiantService.chercherParCodeEtDate(
                registerRequest.getCodeApogee(),
                registerRequest.getCodeMassar(),
                registerRequest.getDateNaissance()
        );

        if (etuOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Étudiant non reconnu");
        }

        

        // 1) Création du compte Utilisateur
        Utilisateur user = new Utilisateur();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(registerRequest.getPassword());
        user.setRole(Role.ETUDIANT);
        user.setNom(registerRequest.getNom());
        user.setPrenom(registerRequest.getPrenom());
        user.setTelephone(registerRequest.getTelephone());
        user = utilisateurService.enregistrer(user);

        // 2) Mise à jour de l'entité Etudiant
        Etudiant etu = etuOpt.get();
        etu.setUtilisateur(user);
        etu.setTelephone(registerRequest.getTelephone());
        etu.setEmail(registerRequest.getEmail());    // ← ici
        etu.setNom(registerRequest.getNom());        // ← ici
        etu.setPrenom(registerRequest.getPrenom());  // ← ici
        etu.setPassword(registerRequest.getPassword());
        etu.setRole(Role.ETUDIANT);
        etudiantService.enregistrer(etu);

        return ResponseEntity.ok("Inscription réussie !");
    }


    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequest request) {
        try {
            String refreshToken = request.getRefreshToken();

            // Validate the refresh token
            if (!jwtUtil.validateJwtToken(refreshToken)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
            }

            // Extract claims from refresh token
            Claims claims = jwtUtil.extractAllClaims(refreshToken);
            String email = claims.getSubject();

            // Generate new tokens
            String newToken = jwtUtil.generateToken(email);
            String newRefreshToken = jwtUtil.createRefreshToken(email);

            Utilisateur user = utilisateurService.findByEmail(email);
            return ResponseEntity.ok(new JwtResponse(newToken, newRefreshToken, user.getRole().name(), user));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
//    static class JwtResponse {
//        private String token;
//        private String role;
//
//        public JwtResponse(String token, String role) {
//            this.token = token;
//            this.role = role;
//        }
//
//        public String getToken() {
//            return token;
//        }
//
//        public String getRole() {
//            return role;
//        }
//    }

}