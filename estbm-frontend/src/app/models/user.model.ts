

// export interface User {
//   id: number;
//   email: string;
//   nom: string;
//   prenom: string;
//   role: "ETUDIANT" | "ENCADRANT" | "ADMIN";
//   telephone?: string;
//   codeApogee?: string;
//   codeMassar?: string;
//   dateNaissance?: string;
//   specialite?: string;
//   filiere?: string;
//   niveau?: string;
  
// }

// export interface CreateEncadrantRequest {
//   email: string;
//   password: string;
//   nom: string;
//   prenom: string;
//   telephone: string;
//   specialite: string;
// }

// export interface CreateAdminRequest {
//   email: string;
//   password: string;
//   nom: string;
//   prenom: string;
//   telephone: string;
// }
// export interface Encadrant {
//   id: number;             // encadrant.id (table encadrants) -> must be sent to backend
//   utilisateurId: number;  // utilisateur.id (relation)
//   email?: string;
//   nom?: string;
//   prenom?: string;
//   specialite?: string;
// }




export interface User {
  id: number;
  email: string;
  nom: string;
  prenom: string;
  role: "ETUDIANT" | "ENCADRANT" | "ADMIN";
  telephone?: string;
  codeApogee?: string;
  codeMassar?: string;
  dateNaissance?: string;
  specialite?: string;
  filiere?: string;
  niveau?: string;
}

export interface CreateEncadrantRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
  specialite: string;
}

export interface CreateAdminRequest {
  email: string;
  password: string;
  nom: string;
  prenom: string;
  telephone: string;
}
// src/app/models/user.model.ts (only the Encadrant part shown)
export interface Encadrant extends User {
  utilisateurId?: number;   // id du compte Utilisateur (souvent utile)
  encadrantId?: number;     // id de l'entité encadrant (si différent)
  telephone?: string; // add if missing
  email: string;      // must match User interface type
}



export interface UtilisateurDto {
  id: number;
  email: string;
  nom?: string;
  prenom?: string;
  telephone?: string;
  role?: 'ETUDIANT' | 'ENCADRANT' | 'ADMIN';
}

export interface EncadrantDto {
  id: number;
  utilisateurId?: number;
  email?: string;
  nom?: string;
  prenom?: string;
  specialite?: string;
  telephone?: string; // add this
}
