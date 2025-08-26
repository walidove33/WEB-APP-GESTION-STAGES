package com.wbs.mymovie.estbm.model;

import com.wbs.mymovie.estbm.model.enums.Role;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "utilisateurs")
@Getter @Setter
@AllArgsConstructor @NoArgsConstructor
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    private String nom;
    private String prenom;
    private String telephone;

    @Enumerated(EnumType.STRING)
    private Role role;
}
