package com.wbs.mymovie.estbm.model;


import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "annees_scolaires")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class AnneeScolaire {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String libelle; // ex: "1ère année", "2ème année"

    @OneToMany(mappedBy = "anneeScolaire")
    private List<Etudiant> etudiants;
}
