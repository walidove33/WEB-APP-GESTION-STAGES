package com.wbs.mymovie.estbm.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "documents_modeles")
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DocumentModele {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String type; // Convention, Attestation

    private String templatePath;
}
