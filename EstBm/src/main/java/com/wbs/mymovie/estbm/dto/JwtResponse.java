package com.wbs.mymovie.estbm.dto;

import com.wbs.mymovie.estbm.model.Utilisateur;

public class JwtResponse {
    private String token;
    private String refreshToken; // Add this
    private String role;
    private Utilisateur user;

    public JwtResponse(String token, String refreshToken, String role, Utilisateur user) {
        this.token = token;
        this.refreshToken = refreshToken;
        this.role = role;
        this.user = user;
    }

    // Add getter for refreshToken
    public String getRefreshToken() {
        return refreshToken;
    }

    // Existing getters...
    public String getToken() { return token; }
    public String getRole() { return role; }
    public Utilisateur getUser() { return user; }
}