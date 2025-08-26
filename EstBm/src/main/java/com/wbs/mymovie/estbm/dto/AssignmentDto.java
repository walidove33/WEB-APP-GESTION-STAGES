//// src/main/java/com/wbs/mymovie/estbm/dto/AssignmentDto.java
//package com.wbs.mymovie.estbm.dto;
//
//import lombok.AccessLevel;
//import lombok.Data;
//
//@Data
//public class AssignmentDto {
//    private Long etudiantId;
//    private Long encadrantId;
//    private String etudiantNom;
//    private String encadrantNom;
//}

package com.wbs.mymovie.estbm.dto;

import lombok.Data;

@Data
public class AssignmentDto {
    private Long etudiantId;
    private Long encadrantId;
    private Long departementId;
    private Long classeGroupeId;
    private Long anneeScolaireId;

    private String etudiantNom;
    private String encadrantNom;
    private String departementNom;
    private String classeGroupeNom;
    private String anneeScolaireLibelle;
}