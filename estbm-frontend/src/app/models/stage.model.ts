

// export enum EtatStage {
//   DEMANDE = "DEMANDE",
//   EN_ATTENTE_VALIDATION = "EN_ATTENTE_VALIDATION",
//   VALIDATION_EN_COURS = "VALIDATION_EN_COURS",
//   ACCEPTE = "ACCEPTE",
//   REFUSE = "REFUSE",
//   EN_COURS = "EN_COURS",
//   TERMINE = "TERMINE",
//   RAPPORT_SOUMIS = "RAPPORT_SOUMIS"
// }

// export interface CommentaireRapport {
//   id: number;
//   texte: string;
//   dateCreation: string;
//   rapport: {
//     id: number;
//     stage: {
//       etudiant: { nom: string; prenom: string };
//     };
//   };
//   encadrant: { id: number; nom: string; prenom: string };
// }




// export interface Stage {
//   id: number;
//   sujet: string;
//   entreprise: string;
//   adresseEntreprise?: string;
//   telephoneEntreprise?: string;
//   representantEntreprise?: string;
//   filiere: string;
//   dateDebut: string;
//   dateFin: string;
//   etat: EtatStage;
//   note?: string;
//   etudiant?: {
//     id: number;
//     nom: string;
//     prenom: string;
//     email: string;
//   };
//   encadrant?: {
//     id: number;
//     nom: string;
//     prenom: string;
//     email: string;
//   };
//   dateCreation?: string;
// }

// export interface StageRequest {
//   sujet: string;
//   entreprise: string;
//   adresseEntreprise?: string;
//   telephoneEntreprise?: string;
//   representantEntreprise?: string;
//   filiere: string;
//   dateDebut: string;
//   dateFin: string;
//   idEtudiant?: number;
// }


// export interface Rapport {
//   id: number;
//   nom: string;
//   dateUpload: string;
//   etat: "EN_ATTENTE" | "VALIDE" | "REFUSE";
//   commentaire?: string;
//   stageId: number;
//   data?: Blob;
//   cloudinaryUrl?: string; // Ajouter cette propriété
// }

// // export interface AssignmentRequest {
// //   encadrantId: number;
// //   departementId: number;
// //   classeGroupeId: number;
// //   anneeScolaireId: number;
// // }


// // src/app/models/assignment-request.ts
// export interface AssignmentRequest {
//   encadrantId: number;
//   departementId: number;
//   classeGroupeId: number;
//   anneeScolaireId: number;
// }


// export interface StudentAssignment {
//   id: number;
//   idEtudiant: number;
//   idEncadrant: number;
//   stageId?: number;
//   createdAt: string;
//   etudiant?: {
//     id: number;
//     nom: string;
//     prenom: string;
//     email: string;
//   };
//   encadrant?: {
//     id: number;
//     nom: string;
//     prenom: string;
//     email: string;
//   };
//   stage?: Stage;
// }

// export interface DecisionDto {
//   idStage: number;
//   approuver: boolean;
// }


// // src/app/models/stage.model.ts
// export interface RapportDetails {
// etat: string;
//   rapportId: number;
//   nomFichier: string;
//   dateDepot: string;
//   stageId: number;
//   cloudinaryUrl: string;
  
//   etudiantId: number;
//   etudiantNom: string;
//   etudiantPrenom: string;
  
//   classeGroupeId: number;
//   classeGroupeNom: string;
  
//   departementId: number;
//   departementNom: string;
  
//   anneeScolaireId: number;
//   anneeScolaireValeur: string;
// }




// export interface Departement {
//   id: number;
//   nom: string;
// }

// export interface ClasseGroupe {
//   id: number;
//   nom: string;
// }

// export interface AnneeScolaire {
//   id: number;
//   libelle: string;
// }

// // Modifiez votre interface pour utiliser number ou string
// export interface GroupAssignmentRequest {
//   encadrantId: number | string;
//   departementId: number | string;
//   classeGroupeId: number | string;
//   anneeScolaireId: number | string;
// }

// export interface EncadrantDetails {
//   id: number;
//   nom: string;
//   prenom: string;
//   specialite: string | null;
//   departement: { id: number; nom: string } | null;
// }

// export interface PlanificationSoutenanceResponse {
//   id: number;
//   dateSoutenance: string; // ISO date, ex. "2025-09-15"
//   encadrant: EncadrantDetails | null;
//   departement: { id: number; nom: string };
//   classeGroupe: { id: number; nom: string };
//   anneeScolaire: { id: number; libelle: string };
// }
// export interface DetailSoutenance {
//   id: number;
//   sujet: string;
//   dateSoutenance: string; // ISO date
//   heureDebut: string;     // "HH:mm:ss"
//   heureFin: string;       // "HH:mm:ss"
//   etudiant: { id: number; nom?: string; prenom?: string };
//   planification: { id: number };
// }
// export interface SoutenanceEtudiantSlotDto {
//   etudiantId: number;
//   date: string;       // ISO date
//   heureDebut: string; // "HH:mm:ss"
//   heureFin: string;   // "HH:mm:ss"
//   sujet: string;
// }




export enum EtatStage {
  DEMANDE = "DEMANDE",
  EN_ATTENTE_VALIDATION = "EN_ATTENTE_VALIDATION",
  VALIDATION_EN_COURS = "VALIDATION_EN_COURS",
  ACCEPTE = "ACCEPTE",
  REFUSE = "REFUSE",
  EN_COURS = "EN_COURS",
  TERMINE = "TERMINE",
  RAPPORT_SOUMIS = "RAPPORT_SOUMIS"
}

export interface CommentaireRapport {
  id: number;
  texte: string;
  dateCreation: string;
  rapport: {
    id: number;
    stage: {
      etudiant: { nom: string; prenom: string };
    };
  };
  encadrant: { id: number; nom: string; prenom: string };
}




export interface Stage {
  id: number;
  sujet: string;
  entreprise: string;
  adresseEntreprise?: string;
  telephoneEntreprise?: string;
  representantEntreprise?: string;
  filiere: string;
  dateDebut: string;
  dateFin: string;
  etat: EtatStage;
  note?: string;
  etudiant?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
    rapport?: Rapport;   // ← ici

  encadrant?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  dateCreation?: string;
}

export interface StageRequest {
  sujet: string;
  entreprise: string;
  adresseEntreprise?: string;
  telephoneEntreprise?: string;
  representantEntreprise?: string;
  filiere: string;
  dateDebut: string;
  dateFin: string;
  idEtudiant?: number;
}


export interface Rapport {
  id: number;
  nom: string;
  dateUpload: string;
  etat: "EN_ATTENTE" | "VALIDE" | "REFUSE";
  commentaire?: string;
  stageId: number;
  data?: Blob;
  cloudinaryUrl?: string; // Ajouter cette propriété
}

// export interface AssignmentRequest {
//   encadrantId: number;
//   departementId: number;
//   classeGroupeId: number;
//   anneeScolaireId: number;
// }


// src/app/models/assignment-request.ts
export interface AssignmentRequest {
  encadrantId: number;
  departementId: number;
  classeGroupeId: number;
  anneeScolaireId: number;
}


export interface StudentAssignment {
  id: number;
  idEtudiant: number;
  idEncadrant: number;
  stageId?: number;
  createdAt: string;
  etudiant?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  encadrant?: {
    id: number;
    nom: string;
    prenom: string;
    email: string;
  };
  stage?: Stage;
}

export interface DecisionDto {
  idStage: number;
  approuver: boolean;
}


// src/app/models/stage.model.ts
export interface RapportDetails {
etat: string;
  rapportId: number;
  nomFichier: string;
  dateDepot: string;
  stageId: number;
  cloudinaryUrl: string;
  
  etudiantId: number;
  etudiantNom: string;
  etudiantPrenom: string;
  
  classeGroupeId: number;
  classeGroupeNom: string;
  
  departementId: number;
  departementNom: string;
  
  anneeScolaireId: number;
  anneeScolaireValeur: string;
}




export interface Departement {
  id: number;
  nom: string;
}

export interface ClasseGroupe {
  id: number;
  nom: string;
}

export interface AnneeScolaire {
  id: number;
  libelle: string;
}

// Modifiez votre interface pour utiliser number ou string
export interface GroupAssignmentRequest {
  encadrantId: number | string;
  departementId: number | string;
  classeGroupeId: number | string;
  anneeScolaireId: number | string;
}

export interface EncadrantDetails {
  id: number;
  nom: string;
  prenom: string;
  specialite: string | null;
  departement: { id: number; nom: string } | null;
}

export interface PlanificationSoutenanceResponse {
  id: number;
  dateSoutenance: string; // ISO date, ex. "2025-09-15"
  encadrant: EncadrantDetails | null;
  departement: { id: number; nom: string };
  classeGroupe: { id: number; nom: string };
  anneeScolaire: { id: number; libelle: string };
}

export interface DetailSoutenance {
  id: number;
  sujet: string;
  dateSoutenance: string; // ISO date
  heureDebut: string;     // "HH:mm:ss"
  heureFin: string;       // "HH:mm:ss"
  etudiant: { id: number; nom?: string; prenom?: string };
  planification: { id: number };
}

export interface SoutenanceEtudiantSlotDto {
entreprise: any;
  etudiantId: number;
  date: string;       // ISO date
  heureDebut: string; // "HH:mm:ss"
  heureFin: string;   // "HH:mm:ss"
  sujet: string;
}

export interface DataTableColumn<T> {
  label: string;
  sortable: boolean;
  type: 'text' | 'number' | 'date';
  // either a direct key of T...
  key?: keyof T;
  // ...or a custom extractor for nested paths
  extractor?: (row: T) => string | number;
}


const planifColumns: DataTableColumn<PlanificationSoutenanceResponse>[] = [
  {
    label: 'Département',
    sortable: true,
    type: 'text',
    extractor: row => row.departement.nom
  },
  {
    label: 'Classe/Groupe',
    sortable: true,
    type: 'text',
    extractor: row => row.classeGroupe.nom
  },
  {
    label: 'Année Scolaire',
    sortable: true,
    type: 'text',
    extractor: row => row.anneeScolaire.libelle
  },
  // any other direct fields can still use ‘key’
  {
    label: 'Date Soutenance',
    sortable: true,
    type: 'date',
    key: 'dateSoutenance'
  }
];


