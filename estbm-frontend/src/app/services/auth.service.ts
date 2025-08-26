
  // import { Injectable } from "@angular/core"
  // import  { HttpClient } from "@angular/common/http"
  // import {  Observable, BehaviorSubject, throwError } from "rxjs"
  // import { tap, catchError } from "rxjs/operators"
  // import  { AuthResponse, LoginRequest, RegisterRequest } from "../models/auth.model"
  // import  { User } from "../models/user.model"

  // @Injectable({ providedIn: "root" })
  // export class AuthService {
  //   private baseUrl = "http://localhost:8081/stages/auth"
  //   private currentUserSubject = new BehaviorSubject<User | null>(null)
  //   public currentUser$ = this.currentUserSubject.asObservable()

  //   constructor(private http: HttpClient) {
  //     this.loadUserFromStorage()
  //   }

  //   login(data: LoginRequest): Observable<AuthResponse> {
  //     console.log("🔐 Attempting login for:", data.email)
  //     return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
  //       tap((res) => {
  //         console.log("✅ Login successful:", res)
  //         localStorage.setItem("token", res.token)
  //         if (res.refreshToken) {
  //           localStorage.setItem("refreshToken", res.refreshToken)
  //         }
  //         localStorage.setItem("role", res.role as string)
  //         const user = res.user as User
  //         localStorage.setItem("user", JSON.stringify(user))
  //         this.currentUserSubject.next(user)
  //         console.log("💾 User data saved to localStorage")
  //       }),
  //       catchError((err) => {
  //         console.error("❌ Login failed:", err)
  //         return throwError(() => err)
  //       }),
  //     )
  //   }

  //   register(data: RegisterRequest): Observable<any> {
  //     return this.http.post(`${this.baseUrl}/register`, data).pipe(catchError((err) => throwError(() => err)))
  //   }

  //   logout(): void {
  //     console.log("🚪 Logging out user")
  //     localStorage.clear()
  //     this.currentUserSubject.next(null)
  //   }

 


  //   isAuthenticated(): boolean {
  //   const token = this.getToken();
  //   if (!token) return false;

  //   try {
  //     const decoded = this.decodeToken(token);
  //     const now = Date.now() / 1000;
  //     return decoded.exp > now; // Vérifie si le token est expiré
  //   } catch {
  //     return false;
  //   }
  // }

  // refreshToken(): Observable<AuthResponse> {
  //   const refreshToken = localStorage.getItem('refreshToken');
  //   return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken });
  // }

  //   getUserRole(): "ETUDIANT" | "ENCADRANT" | "ADMIN" | null {
  //     try {
  //       const token = this.getToken()
  //       if (!token) return null
  //       const decoded = this.decodeToken(token)
  //       const role = decoded.role || decoded.authorities?.[0]?.replace("ROLE_", "") || null
  //       console.log("👤 User role from token:", role)
  //       return role
  //     } catch {
  //       const fallbackRole = localStorage.getItem("role") as "ETUDIANT" | "ENCADRANT" | "ADMIN" | null
  //       console.log("👤 User role from fallback:", fallbackRole)
  //       return fallbackRole
  //     }
  //   }

  //   getUserId(): number | null {
  //     const user = this.getCurrentUser();
  //   return user ? user.id : null;
  //   }

  //   getUserEmail(): string | null {
  //     const user = this.getCurrentUser();
  //   return user ? user.email : null;
  //   }

  //   getToken(): string | null {
  //     const token = localStorage.getItem("token")
  //     console.log("🎫 Retrieved token:", token ? "Present" : "Not found")
  //     return token
  //   }

  //   getCurrentUser(): User | null {
  //     return this.currentUserSubject.value
  //   }

  //   fetchProfile(): Observable<User> {
  //     return this.http.get<User>(`${this.baseUrl}/me`).pipe(
  //       tap((u) => {
  //         this.currentUserSubject.next(u)
  //         localStorage.setItem("user", JSON.stringify(u))
  //       }),
  //       catchError((err) => throwError(() => err)),
  //     )
  //   }

  //   private loadUserFromStorage(): void {
  //     const stored = localStorage.getItem("user")
  //     if (stored) {
  //       try {
  //         const user = JSON.parse(stored)
  //         this.currentUserSubject.next(user)
  //         console.log("👤 Loaded user from storage:", user)
  //       } catch (error) {
  //         console.error("❌ Error parsing stored user:", error)
  //         localStorage.removeItem("user")
  //       }
  //     }
  //   }

  //   private decodeToken(token: string): any {
  //     try {
  //       const payload = token.split(".")[1]
  //       const decoded = JSON.parse(atob(payload))
  //       console.log("🔍 Decoded token:", decoded)
  //       return decoded
  //     } catch (error) {
  //       console.error("❌ Error decoding token:", error)
  //       throw error
  //     }
  //   }



  // }

import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable, BehaviorSubject, throwError, timer } from "rxjs";
import { tap, catchError, switchMap, finalize } from "rxjs/operators";
import { AuthResponse, LoginRequest, RegisterRequest } from "../models/auth.model";
import { User } from "../models/user.model";
import { NotificationService } from "./notification.service";

@Injectable({ providedIn: "root" })
export class AuthService {
  private baseUrl = "http://localhost:8081/stages/auth";
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private loginLoadingSubject = new BehaviorSubject<boolean>(false);
  public loginLoading$ = this.loginLoadingSubject.asObservable();

  private registerLoadingSubject = new BehaviorSubject<boolean>(false);
  public registerLoading$ = this.registerLoadingSubject.asObservable();

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {
    this.loadUserFromStorage();
    this.startSessionMonitoring();
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    this.loginLoadingSubject.next(true);
    const loadingId = this.notificationService.loading(
      'Connexion en cours...',
      'Vérification de vos identifiants'
    );

    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, data).pipe(
      switchMap(response => timer(800).pipe(switchMap(() => [response]))),
      tap(res => {
        localStorage.setItem('token', res.token);
        if (res.refreshToken) {
          localStorage.setItem('refreshToken', res.refreshToken);
        }
        localStorage.setItem('role', res.role as string);

        const user = res.user as User;
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);

        this.notificationService.operationSuccess(
          loadingId,
          'Connexion',
          `Bienvenue ${user.prenom} ${user.nom} !`
        );
      }),
      catchError(err => {
        let errorMessage = 'Une erreur est survenue lors de la connexion';
        if (err.status === 401) {
          errorMessage = 'Email ou mot de passe incorrect';
        } else if (err.status === 403) {
          errorMessage = 'Accès refusé. Contactez l\'administrateur.';
        } else if (err.status === 0) {
          errorMessage = 'Impossible de se connecter au serveur';
        }
        this.notificationService.operationError(loadingId, 'Connexion', errorMessage);
        return throwError(() => err);
      }),
      finalize(() => this.loginLoadingSubject.next(false))
    );
  }
    getCurrentUser(): User | null {
      return this.currentUserSubject.value
    }

  register(data: RegisterRequest): Observable<any> {
    this.registerLoadingSubject.next(true);
    const loadingId = this.notificationService.loading(
      'Inscription en cours...',
      'Création de votre compte étudiant'
    );

    return this.http.post(`${this.baseUrl}/register`, data).pipe(
      switchMap(response => timer(1000).pipe(switchMap(() => [response]))),
      tap(() => {
        this.notificationService.operationSuccess(
          loadingId,
          'Inscription',
          `Compte créé pour ${data.prenom} ${data.nom}. Vous pouvez maintenant vous connecter.`
        );
      }),
      catchError(err => {
        let errorMessage = 'Une erreur est survenue lors de linscription';
        if (err.status === 400) {
          errorMessage = err.error || 'Données invalides';
        } else if (err.status === 409) {
          errorMessage = 'Un compte existe déjà avec cet email';
        } else if (err.status === 401) {
          errorMessage = 'Étudiant non reconnu dans le système';
        }
        this.notificationService.operationError(loadingId, 'Inscription', errorMessage);
        return throwError(() => err);
      }),
      finalize(() => this.registerLoadingSubject.next(false))
    );
  }

  logout(): void {
    const loadingId = this.notificationService.loading('Déconnexion...', 'À bientôt !');
    setTimeout(() => {
      localStorage.clear();
      this.currentUserSubject.next(null);
      this.notificationService.operationSuccess(
        loadingId,
        'Déconnexion',
        'Vous avez été déconnecté avec succès'
      );
    }, 500);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    try {
      const decoded = this.decodeToken(token);
      const nowSec = Date.now() / 1000;
      if (decoded.exp <= nowSec) {
        this.logout();
        return false;
      }
      return true;
    } catch {
      this.logout();
      return false;
    }
  }

  refreshToken(): Observable<AuthResponse> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    const loadingId = this.notificationService.loading(
      'Actualisation de la session...',
      'Renouvellement automatique'
    );

    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, { refreshToken }).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
        if (response.refreshToken) {
          localStorage.setItem('refreshToken', response.refreshToken);
        }
        this.notificationService.operationSuccess(
          loadingId,
          'Session',
          'Session renouvelée automatiquement'
        );
      }),
      catchError(err => {
        this.notificationService.operationError(
          loadingId,
          'Session',
          'Impossible de renouveler la session. Veuillez vous reconnecter.'
        );
        this.logout();
        return throwError(() => err);
      })
    );
  }

  getUserRole(): "ETUDIANT" | "ENCADRANT" | "ADMIN" | null {
    try {
      const token = this.getToken();
      if (!token) return null;
      const decoded = this.decodeToken(token);
      return decoded.role || decoded.authorities?.[0]?.replace('ROLE_', '') || null;
    } catch {
      return (localStorage.getItem('role') as any) || null;
    }
  }

  getUserId(): number | null {
    const user = this.currentUserSubject.value;
    return user ? user.id : null;
  }

  getUserEmail(): string | null {
    const user = this.currentUserSubject.value;
    return user ? user.email : null;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  fetchProfile(): Observable<User> {
    const loadingId = this.notificationService.loading(
      'Chargement du profil...',
      'Récupération de vos informations'
    );
    return this.http.get<User>(`${this.baseUrl}/me`).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
        this.notificationService.operationSuccess(
          loadingId,
          'Profil',
          'Informations mises à jour'
        );
      }),
      catchError(err => {
        this.notificationService.operationError(
          loadingId,
          'Profil',
          'Impossible de charger le profil'
        );
        return throwError(() => err);
      })
    );
  }

  updateProfile(profileData: Partial<User>): Observable<User> {
    const loadingId = this.notificationService.loading(
      'Mise à jour du profil...',
      'Sauvegarde de vos modifications'
    );
    return this.http.put<User>(`${this.baseUrl}/profile`, profileData).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        this.notificationService.operationSuccess(
          loadingId,
          'Profil',
          'Vos informations ont été mises à jour avec succès'
        );
      }),
      catchError(err => {
        this.notificationService.operationError(
          loadingId,
          'Profil',
          'Impossible de mettre à jour le profil'
        );
        return throwError(() => err);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const loadingId = this.notificationService.loading(
      'Modification du mot de passe...',
      'Sécurisation de votre compte'
    );
    return this.http.put(`${this.baseUrl}/change-password`, { currentPassword, newPassword }).pipe(
      tap(() => this.notificationService.operationSuccess(
        loadingId,
        'Mot de passe',
        'Votre mot de passe a été modifié avec succès'
      )),
      catchError(err => {
        let errorMessage = 'Impossible de modifier le mot de passe';
        if (err.status === 400) errorMessage = 'Mot de passe actuel incorrect';
        this.notificationService.operationError(
          loadingId,
          'Mot de passe',
          errorMessage
        );
        return throwError(() => err);
      })
    );
  }

  private loadUserFromStorage(): void {
    const raw = localStorage.getItem('user');
    if (raw) {
      try {
        const user = JSON.parse(raw);
        this.currentUserSubject.next(user);
        if (!this.isAuthenticated()) {
          this.notificationService.warning(
            'Session expirée',
            'Veuillez vous reconnecter.'
          );
        }
      } catch {
        localStorage.removeItem('user');
      }
    }
  }

  private decodeToken(token: string): any {
    const parts = token.split('.');
    if (parts.length !== 3) throw new Error('Invalid token');
    return JSON.parse(atob(parts[1]));
  }

  private startSessionMonitoring(): void {
    timer(0, 5 * 60 * 1000).subscribe(() => {
      if (!this.isAuthenticated()) return;
      const token = this.getToken();
      if (!token) return;
      const decoded = this.decodeToken(token);
      const expiresIn = decoded.exp * 1000 - Date.now();
      if (expiresIn < 10 * 60 * 1000 && expiresIn > 9 * 60 * 1000) {
        this.notificationService.warning(
          'Session bientôt expirée',
          'Votre session expirera dans 10 minutes.',
          0,
          [{
            label: 'Prolonger',
            style: 'primary',
            action: () => this.refreshToken().subscribe()
          }]
        );
      }
    });
  }
}