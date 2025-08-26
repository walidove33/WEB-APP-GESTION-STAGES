//package com.wbs.mymovie.estbm.model;
//
//import jakarta.persistence.*;
//import lombok.*;
//import java.util.List;
//
//@Entity
//@Table(name = "departements")
//@Getter @Setter
//@NoArgsConstructor @AllArgsConstructor
//public class Departement {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Long id;
//
//    @Column(nullable = false, unique = true)
//    private String nom;
//
//    @OneToMany(mappedBy = "departement")
//    private List<Etudiant> etudiants;
//
//    @OneToMany(mappedBy = "departement")
//    private List<Encadrant> encadrants;
//}


package com.wbs.mymovie.estbm.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "departements")
@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class Departement {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String nom;

    @OneToMany(mappedBy = "departement")
    private List<Encadrant> encadrants;


    @OneToMany(mappedBy = "departement")
    @JsonManagedReference("etudiant-departement")
    private List<Etudiant> etudiants;

}