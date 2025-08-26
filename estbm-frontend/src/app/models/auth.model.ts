

export interface LoginRequest {
  email: string;
  password: string;
}

// src/app/models/auth.model.ts
export interface RegisterRequest {
  nom: string;
  prenom: string;
  specialite: string;     // au lieu de filiere/niveau
  codeApogee: string;
  codeMassar: string;
  dateNaissance: string;  // format "YYYY-MM-DD"
  email: string;
  password: string;
  telephone: string;
}


export interface AuthResponse {
  token: string;
  refreshToken?: string;
  role: string;
  user: {
    id: number;
    email: string;
    nom: string;
    prenom: string;
    role: string;
    telephone?: string;
  };

  
}