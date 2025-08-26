package com.wbs.mymovie.estbm.model;


import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "classes_groupes")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class ClasseGroupe {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;  // ex: Groupe1, Groupe2...

    @OneToMany(mappedBy = "classeGroupe")
    @JsonManagedReference("etudiant-classe")
    private List<Etudiant> etudiants;



    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_departemen")  // ← colonne FK
    private Departement departement;

}