

// import { Injectable } from "@angular/core"
// import { HttpClient, HttpParams } from "@angular/common/http"
// import { Observable, throwError, timer } from "rxjs"
// import { catchError, tap, switchMap } from "rxjs/operators"
// import { User } from "../models/user.model"
// import { CreateAdminRequest, CreateEncadrantRequest } from '../models/user.model'
// import { NotificationService } from "./notification.service"
// import {  map } from "rxjs/operators";


// @Injectable({
//   providedIn: "root",
// })
// export class UserService {
//   private baseUrl = "http://localhost:8081/stages"

//   constructor(
//     private http: HttpClient,
//     private notificationService: NotificationService
//   ) {}

//   getAllUsers(): Observable<User[]> {
//     const loadingId = this.notificationService.loading(
//       'Chargement des utilisateurs...', 
//       'Récupération de tous les comptes'
//     )

//     return this.http.get<User[]>(`${this.baseUrl}/admin/users`).pipe(
//       switchMap(users => timer(400).pipe(switchMap(() => [users]))),
      
//       tap((users) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Utilisateurs',
//           `${users.length} utilisateur(s) dans le système`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Utilisateurs',
//           'Impossible de charger les utilisateurs'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   getUsersByRole(role: string): Observable<User[]> {
//     const loadingId = this.notificationService.loading(
//       `Chargement des ${role.toLowerCase()}s...`, 
//       'Filtrage par rôle'
//     )

//     return this.http.get<User[]>(`${this.baseUrl}/admin/users/role/${role}`).pipe(
//       switchMap(users => timer(300).pipe(switchMap(() => [users]))),
      
//       tap((users) => {
//         const roleLabel = this.getRoleLabel(role)
//         this.notificationService.operationSuccess(
//           loadingId,
//           roleLabel,
//           `${users.length} ${roleLabel.toLowerCase()} trouvé(s)`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Filtrage',
//           `Impossible de charger les ${role.toLowerCase()}s`
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   getStudents(): Observable<User[]> {
//     return this.getUsersByRole("ETUDIANT")
//   }

//   getEncadrants(): Observable<User[]> {
//     return this.getUsersByRole("ENCADRANT")
//   }

//   getAdmins(): Observable<User[]> {
//     const loadingId = this.notificationService.loading(
//       'Chargement des administrateurs...', 
//       'Récupération des comptes admin'
//     )

//     return this.http.get<User[]>(`${this.baseUrl}/admins`).pipe(
//       switchMap(admins => timer(300).pipe(switchMap(() => [admins]))),
      
//       tap((admins) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Administrateurs',
//           `${admins.length} administrateur(s) enregistré(s)`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Administrateurs',
//           'Impossible de charger les administrateurs'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   createAdmin(admin: CreateAdminRequest): Observable<User> {
//     const loadingId = this.notificationService.loading(
//       'Création de l\'administrateur...', 
//       `Création du compte pour ${admin.prenom} ${admin.nom}`
//     )

//     return this.http.post<User>(`${this.baseUrl}/admins`, admin).pipe(
//       switchMap(user => timer(800).pipe(switchMap(() => [user]))),
      
//       tap((user) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Administrateur créé',
//           `Compte créé pour ${user.prenom} ${user.nom} (${user.email})`
//         )
//       }),
      
//       catchError((error) => {
//         let errorMessage = 'Impossible de créer l\'administrateur'
//         if (error.status === 409) {
//           errorMessage = 'Un compte existe déjà avec cet email'
//         } else if (error.status === 400) {
//           errorMessage = 'Données invalides'
//         }
        
//         this.notificationService.operationError(
//           loadingId,
//           'Création administrateur',
//           errorMessage
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   createEncadrant(encadrant: CreateEncadrantRequest): Observable<any> {
//     const loadingId = this.notificationService.loading(
//       'Création de l\'encadrant...', 
//       `Création du compte pour ${encadrant.prenom} ${encadrant.nom} (${encadrant.specialite})`
//     )

//     return this.http.post(`${this.baseUrl}/encadrants`, encadrant).pipe(
//       switchMap(user => timer(1000).pipe(switchMap(() => [user]))),
      
//       tap((user) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Encadrant créé',
//           `Compte créé pour ${encadrant.prenom} ${encadrant.nom} - Spécialité: ${encadrant.specialite}`
//         )
//       }),
      
//       catchError((error) => {
//         let errorMessage = 'Impossible de créer l\'encadrant'
//         if (error.status === 409) {
//           errorMessage = 'Un compte existe déjà avec cet email'
//         } else if (error.status === 400) {
//           errorMessage = 'Données invalides ou spécialité non reconnue'
//         }
        
//         this.notificationService.operationError(
//           loadingId,
//           'Création encadrant',
//           errorMessage
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   deleteAdmin(id: number): Observable<void> {
//     const loadingId = this.notificationService.loading(
//       'Suppression de l\'administrateur...', 
//       'Retrait du compte du système'
//     )

//     return this.http.delete<void>(`${this.baseUrl}/admins/${id}`).pipe(
//       switchMap(response => timer(600).pipe(switchMap(() => [response]))),
      
//       tap(() => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Administrateur supprimé',
//           'Le compte a été retiré du système avec succès'
//         )
//       }),
      
//       catchError((error) => {
//         let errorMessage = 'Impossible de supprimer l\'administrateur'
//         if (error.status === 409) {
//           errorMessage = 'Impossible de supprimer: administrateur lié à des données'
//         } else if (error.status === 403) {
//           errorMessage = 'Vous ne pouvez pas supprimer ce compte'
//         }
        
//         this.notificationService.operationError(
//           loadingId,
//           'Suppression',
//           errorMessage
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   deleteEncadrant(id: number): Observable<void> {
//     const loadingId = this.notificationService.loading(
//       'Suppression de l\'encadrant...', 
//       'Vérification des stages en cours...'
//     )

//     return this.http.delete<void>(`${this.baseUrl}/encadrants/${id}`).pipe(
//       switchMap(response => timer(700).pipe(switchMap(() => [response]))),
      
//       tap(() => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Encadrant supprimé',
//           'Le compte encadrant a été retiré du système'
//         )
//       }),
      
//       catchError((error) => {
//         let errorMessage = 'Impossible de supprimer l\'encadrant'
//         if (error.status === 409) {
//           errorMessage = 'Impossible de supprimer: encadrant assigné à des stages actifs'
//         } else if (error.status === 403) {
//           errorMessage = 'Vous ne pouvez pas supprimer ce compte'
//         }
        
//         this.notificationService.operationError(
//           loadingId,
//           'Suppression',
//           errorMessage
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   createUser(user: Partial<User>): Observable<User> {
//     const loadingId = this.notificationService.loading(
//       'Création de l\'utilisateur...', 
//       'Enregistrement des informations'
//     )

//     return this.http.post<User>(`${this.baseUrl}/admin/users`, user).pipe(
//       switchMap(newUser => timer(600).pipe(switchMap(() => [newUser]))),
      
//       tap((newUser) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Utilisateur créé',
//           `Compte créé pour ${newUser.prenom} ${newUser.nom}`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Création utilisateur',
//           'Impossible de créer l\'utilisateur'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   updateUser(id: number, user: Partial<User>): Observable<User> {
//     const loadingId = this.notificationService.loading(
//       'Mise à jour de l\'utilisateur...', 
//       'Sauvegarde des modifications'
//     )

//     return this.http.put<User>(`${this.baseUrl}/admin/users/${id}`, user).pipe(
//       switchMap(updatedUser => timer(500).pipe(switchMap(() => [updatedUser]))),
      
//       tap((updatedUser) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Utilisateur mis à jour',
//           `Informations mises à jour pour ${updatedUser.prenom} ${updatedUser.nom}`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Mise à jour',
//           'Impossible de mettre à jour l\'utilisateur'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   deleteUser(id: number): Observable<void> {
//     const loadingId = this.notificationService.loading(
//       'Suppression de l\'utilisateur...', 
//       'Retrait du système'
//     )

//     return this.http.delete<void>(`${this.baseUrl}/admin/users/${id}`).pipe(
//       switchMap(response => timer(500).pipe(switchMap(() => [response]))),
      
//       tap(() => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Utilisateur supprimé',
//           'Le compte a été supprimé avec succès'
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Suppression',
//           'Impossible de supprimer l\'utilisateur'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   // ==================== BATCH OPERATIONS ====================

//   batchCreateUsers(users: Partial<User>[]): Observable<User[]> {
//     const operations = users.map((user, index) => `Création utilisateur ${index + 1}`)
    
//     this.notificationService.batchOperation(operations, () => {
//       this.notificationService.successWithBounce(
//         'Création en lot terminée',
//         `${users.length} utilisateurs créés avec succès`
//       )
//     })

//     // Simulate batch creation
//     return timer(users.length * 300).pipe(
//       switchMap(() => this.http.post<User[]>(`${this.baseUrl}/admin/users/batch`, users)),
//       catchError(this.handleError)
//     )
//   }

//   batchDeleteUsers(ids: number[]): Observable<void> {
//     const operations = ids.map(id => `Suppression utilisateur #${id}`)
    
//     this.notificationService.batchOperation(operations, () => {
//       this.notificationService.successWithBounce(
//         'Suppression en lot terminée',
//         `${ids.length} utilisateurs supprimés`
//       )
//     })

//     return timer(ids.length * 200).pipe(
//       switchMap(() => this.http.delete<void>(`${this.baseUrl}/admin/users/batch`, { body: ids })),
//       catchError(this.handleError)
//     )
//   }

//   // ==================== SEARCH AND FILTER ====================

//   searchUsers(query: string, role?: string): Observable<User[]> {
//     const loadingId = this.notificationService.loading(
//       'Recherche en cours...', 
//       `Recherche de "${query}"`
//     )

//     let params = new HttpParams().set('q', query)
//     if (role) {
//       params = params.set('role', role)
//     }

//     return this.http.get<User[]>(`${this.baseUrl}/admin/users/search`, { params }).pipe(
//       switchMap(users => timer(400).pipe(switchMap(() => [users]))),
      
//       tap((users) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Recherche',
//           `${users.length} résultat(s) pour "${query}"`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Recherche',
//           'Erreur lors de la recherche'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   // ==================== USER STATISTICS ====================

//   getUserStats(): Observable<any> {
//     const loadingId = this.notificationService.loading(
//       'Calcul des statistiques...', 
//       'Analyse des données utilisateurs'
//     )

//     return this.http.get<any>(`${this.baseUrl}/admin/users/stats`).pipe(
//       switchMap(stats => timer(500).pipe(switchMap(() => [stats]))),
      
//       tap((stats) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Statistiques utilisateurs',
//           `${stats.total} utilisateurs analysés`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Statistiques',
//           'Impossible de calculer les statistiques'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   // ==================== USER PROFILE MANAGEMENT ====================

//   updateUserProfile(id: number, profileData: any): Observable<User> {
//     const loadingId = this.notificationService.loading(
//       'Mise à jour du profil...', 
//       'Sauvegarde des modifications'
//     )

//     return this.http.put<User>(`${this.baseUrl}/admin/users/${id}/profile`, profileData).pipe(
//       switchMap(user => timer(500).pipe(switchMap(() => [user]))),
      
//       tap((user) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Profil mis à jour',
//           `Profil de ${user.prenom} ${user.nom} mis à jour`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Mise à jour profil',
//           'Impossible de mettre à jour le profil'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   resetUserPassword(id: number): Observable<{ temporaryPassword: string }> {
//     const loadingId = this.notificationService.loading(
//       'Réinitialisation du mot de passe...', 
//       'Génération d\'un nouveau mot de passe'
//     )

//     return this.http.post<{ temporaryPassword: string }>(`${this.baseUrl}/admin/users/${id}/reset-password`, {}).pipe(
//       switchMap(response => timer(600).pipe(switchMap(() => [response]))),
      
//       tap((response) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Mot de passe réinitialisé',
//           `Nouveau mot de passe temporaire généré: ${response.temporaryPassword}`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Réinitialisation',
//           'Impossible de réinitialiser le mot de passe'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   // ==================== USER ACTIVATION/DEACTIVATION ====================

//   activateUser(id: number): Observable<User> {
//     const loadingId = this.notificationService.loading(
//       'Activation du compte...', 
//       'Réactivation de l\'utilisateur'
//     )

//     return this.http.put<User>(`${this.baseUrl}/admin/users/${id}/activate`, {}).pipe(
//       switchMap(user => timer(400).pipe(switchMap(() => [user]))),
      
//       tap((user) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Compte activé',
//           `${user.prenom} ${user.nom} peut maintenant se connecter`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Activation',
//           'Impossible d\'activer le compte'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   deactivateUser(id: number): Observable<User> {
//     const loadingId = this.notificationService.loading(
//       'Désactivation du compte...', 
//       'Suspension de l\'accès utilisateur'
//     )

//     return this.http.put<User>(`${this.baseUrl}/admin/users/${id}/deactivate`, {}).pipe(
//       switchMap(user => timer(400).pipe(switchMap(() => [user]))),
      
//       tap((user) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Compte désactivé',
//           `Accès suspendu pour ${user.prenom} ${user.nom}`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Désactivation',
//           'Impossible de désactiver le compte'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   // ==================== BULK OPERATIONS ====================

//   bulkUpdateUsers(updates: { id: number, data: Partial<User> }[]): Observable<User[]> {
//     const loadingId = this.notificationService.loading(
//       'Mise à jour en lot...', 
//       `Modification de ${updates.length} utilisateur(s)`
//     )

//     return this.http.put<User[]>(`${this.baseUrl}/admin/users/bulk-update`, updates).pipe(
//       switchMap(users => timer(updates.length * 200).pipe(switchMap(() => [users]))),
      
//       tap((users) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Mise à jour en lot',
//           `${users.length} utilisateur(s) mis à jour avec succès`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Mise à jour en lot',
//           'Erreur lors de la mise à jour en lot'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   // ==================== EXPORT/IMPORT ====================

//   exportUsers(format: 'csv' | 'excel' | 'pdf' = 'csv'): Observable<Blob> {
//     const loadingId = this.notificationService.loading(
//       'Export en cours...', 
//       `Génération du fichier ${format.toUpperCase()}`
//     )

//     return this.http.get(`${this.baseUrl}/admin/users/export`, {
//       params: { format },
//       responseType: 'blob'
//     }).pipe(
//       switchMap(blob => timer(800).pipe(switchMap(() => [blob]))),
      
//       tap(() => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Export terminé',
//           `Fichier ${format.toUpperCase()} généré avec succès`
//         )
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Export',
//           'Impossible de générer le fichier d\'export'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   importUsers(file: File): Observable<{ success: number, errors: string[] }> {
//     const formData = new FormData()
//     formData.append('file', file)

//     const loadingId = this.notificationService.loading(
//       'Import en cours...', 
//       `Traitement de ${file.name}`
//     )

//     return this.http.post<{ success: number, errors: string[] }>(
//       `${this.baseUrl}/admin/users/import`, 
//       formData
//     ).pipe(
//       switchMap(result => timer(1200).pipe(switchMap(() => [result]))),
      
//       tap((result) => {
//         if (result.errors.length === 0) {
//           this.notificationService.operationSuccess(
//             loadingId,
//             'Import réussi',
//             `${result.success} utilisateur(s) importé(s) avec succès`
//           )
//         } else {
//           this.notificationService.remove(loadingId)
//           this.notificationService.warning(
//             'Import partiellement réussi',
//             `${result.success} utilisateur(s) importé(s), ${result.errors.length} erreur(s)`,
//             8000,
//             [{
//               label: 'Voir les erreurs',
//               style: 'warning',
//               action: () => {
//                 console.log('Import errors:', result.errors)
//                 this.notificationService.error(
//                   'Erreurs d\'import',
//                   result.errors.join('\n')
//                 )
//               }
//             }]
//           )
//         }
//       }),
      
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           'Import',
//           'Impossible d\'importer le fichier'
//         )
//         return this.handleError(error)
//       })
//     )
//   }

//   // ==================== UTILITY METHODS ====================

//   private getRoleLabel(role: string): string {
//     const roleLabels: { [key: string]: string } = {
//       'ETUDIANT': 'Étudiants',
//       'ENCADRANT': 'Encadrants',
//       'ADMIN': 'Administrateurs'
//     }
//     return roleLabels[role] || role
//   }

//   private handleError = (error: any): Observable<never> => {
//     console.error("🚨 UserService error:", error)
    
//     let errorMessage = "Une erreur est survenue"

//     if (error.status === 401) {
//       errorMessage = "Session expirée. Veuillez vous reconnecter."
//     } else if (error.status === 403) {
//       errorMessage = "Accès refusé."
//     } else if (error.status === 404) {
//       errorMessage = "Utilisateur non trouvé."
//     } else if (error.status === 409) {
//       errorMessage = "Conflit: données déjà existantes."
//     } else if (error.status === 0) {
//       errorMessage = "Impossible de se connecter au serveur."
//     } else if (error.error?.message) {
//       errorMessage = error.error.message
//     }

//     return throwError(() => new Error(errorMessage))
//   }

//   // ==================== PERFORMANCE MONITORING ====================


//    getServiceHealth(): Observable<{ status: string, responseTime: number }> {
//   const startTime = Date.now();
  
//   return this.http.get<{ status: string }>(`${this.baseUrl}/health`).pipe(
//     map((response) => ({
//       ...response,
//       responseTime: Date.now() - startTime
//     })),
    
//     tap((health) => {
//       if (health.responseTime > 2000) {
//         this.notificationService.warning(
//           'Performance dégradée',
//           `Temps de réponse élevé: ${health.responseTime}ms`
//         );
//       }
//     }),
    
//     catchError((error) => {
//       this.notificationService.error(
//         'Service indisponible',
//         'Le service utilisateurs ne répond pas'
//       );
//       return throwError(() => error);
//     })
//   );
// }

  

//   // Clear service cache and refresh data
//   refreshAllData(): Observable<any> {
//     const loadingId = this.notificationService.loading(
//       'Actualisation des données...', 
//       'Rechargement complet'
//     )

//     return timer(1000).pipe(
//       tap(() => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           'Données actualisées',
//           'Toutes les données ont été rechargées'
//         )
//       })
//     )
//   }
// }



// import { Injectable } from "@angular/core"
// import  { HttpClient } from "@angular/common/http"
// import { type Observable, throwError } from "rxjs"
// import { catchError } from "rxjs/operators"
// import type { User } from "../models/user.model"
// import { CreateAdminRequest } from '../models/user.model';
// import { CreateEncadrantRequest } from '../models/user.model';




// @Injectable({
//   providedIn: "root",
// })
// export class UserService {
//   private baseUrl = "http://localhost:8081/stages"

//   constructor(private http: HttpClient) {}

//   getAllUsers(): Observable<User[]> {
//     return this.http.get<User[]>(`${this.baseUrl}/admin/users`).pipe(catchError(this.handleError))
//   }

//   getUsersByRole(role: string): Observable<User[]> {
//     return this.http.get<User[]>(`${this.baseUrl}/admin/users/role/${role}`).pipe(catchError(this.handleError))
//   }

//   getStudents(): Observable<User[]> {
//     return this.getUsersByRole("ETUDIANT")
//   }

  
//   getEncadrants(): Observable<User[]> {
//     return this.getUsersByRole("ENCADRANT")
//   }

//   createUser(user: Partial<User>): Observable<User> {
//     return this.http.post<User>(`${this.baseUrl}/admin/users`, user).pipe(catchError(this.handleError))
//   }

//   updateUser(id: number, user: Partial<User>): Observable<User> {
//     return this.http.put<User>(`${this.baseUrl}/admin/users/${id}`, user).pipe(catchError(this.handleError))
//   }

//    getAdmins(): Observable<User[]> {
//     return this.http.get<User[]>(`${this.baseUrl}/admins`);
//   }

//  createAdmin(admin: CreateAdminRequest): Observable<User> {
//   return this.http.post<User>(`${this.baseUrl}/admins`, admin);
// }


//   deleteAdmin(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/admins/${id}`);
//   }

// createEncadrant(encadrant: CreateEncadrantRequest): Observable<any> {
//   return this.http.post(`${this.baseUrl}/encadrants`, encadrant);
// }

//   deleteEncadrant(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/encadrants/${id}`);
//   }

 

//   deleteUser(id: number): Observable<void> {
//     return this.http.delete<void>(`${this.baseUrl}/admin/users/${id}`).pipe(catchError(this.handleError))
//   }

//   private handleError = (error: any): Observable<never> => {
//     console.error("🚨 UserService error:", error)
//     let errorMessage = "Une erreur est survenue"

//     if (error.status === 401) {
//       errorMessage = "Session expirée. Veuillez vous reconnecter."
//     } else if (error.status === 403) {
//       errorMessage = "Accès refusé."
//     } else if (error.status === 404) {
//       errorMessage = "Utilisateur non trouvé."
//     } else if (error.status === 0) {
//       errorMessage = "Impossible de se connecter au serveur."
//     } else if (error.error?.message) {
//       errorMessage = error.error.message
//     }

//     return throwError(() => new Error(errorMessage))
//   }
// }


import { Injectable } from "@angular/core"
import { HttpClient, HttpParams } from "@angular/common/http"
import { Observable, throwError, timer } from "rxjs"
import { catchError, tap, switchMap } from "rxjs/operators"
import {
  User,
  CreateAdminRequest,
  CreateEncadrantRequest,
  UtilisateurDto,
  EncadrantDto,
  Encadrant
} from '../models/user.model';import { NotificationService } from "./notification.service"
import {  map } from "rxjs/operators";


@Injectable({
  providedIn: "root",
})
export class UserService {
private baseUrl = "http://localhost:8081/stages/admin"

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService
  ) {}

  getAllUsers(): Observable<User[]> {
    const loadingId = this.notificationService.loading(
      'Chargement des utilisateurs...', 
      'Récupération de tous les comptes'
    )

    return this.http.get<User[]>(`${this.baseUrl}/users`).pipe(
      switchMap(users => timer(400).pipe(switchMap(() => [users]))),
      
      tap((users) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Utilisateurs',
          `${users.length} utilisateur(s) dans le système`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Utilisateurs',
          'Impossible de charger les utilisateurs'
        )
        return this.handleError(error)
      })
    )
  }

  getUsersByRole(role: string): Observable<User[]> {
    const loadingId = this.notificationService.loading(
      `Chargement des ${role.toLowerCase()}s...`, 
      'Filtrage par rôle'
    )

    return this.http.get<User[]>(`${this.baseUrl}/users/role/${role}`).pipe(
      switchMap(users => timer(300).pipe(switchMap(() => [users]))),
      
      tap((users) => {
        const roleLabel = this.getRoleLabel(role)
        this.notificationService.operationSuccess(
          loadingId,
          roleLabel,
          `${users.length} ${roleLabel.toLowerCase()} trouvé(s)`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Filtrage',
          `Impossible de charger les ${role.toLowerCase()}s`
        )
        return this.handleError(error)
      })
    )
  }


  deleteEncadrant(id: number): Observable<void> {
  const loadingId = this.notificationService.loading(
    'Suppression de l\'encadrant...',
    'Retrait du compte encadrant du système'
  );
  return this.http.delete<void>(`${this.baseUrl}/encadrants/${id}`).pipe(
    switchMap(response => timer(600).pipe(switchMap(() => [response]))),
    tap(() => {
      this.notificationService.operationSuccess(loadingId, 'Encadrant supprimé', 'Le compte encadrant a été supprimé avec succès');
    }),
    catchError((error) => {
      this.notificationService.operationError(loadingId, 'Suppression encadrant', 'Impossible de supprimer l\'encadrant');
      return this.handleError(error);
    })
  );
}



  getStudents(): Observable<User[]> {
    return this.getUsersByRole("ETUDIANT")
  }

  getEncadrants(): Observable<User[]> {
    return this.getUsersByRole("ENCADRANT")
  }

  getAdmins(): Observable<User[]> {
    const loadingId = this.notificationService.loading(
      'Chargement des administrateurs...', 
      'Récupération des comptes admin'
    )

    return this.http.get<User[]>(`${this.baseUrl}/users/role/ADMIN`).pipe(
      switchMap(admins => timer(300).pipe(switchMap(() => [admins]))),
      
      tap((admins) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Administrateurs',
          `${admins.length} administrateur(s) enregistré(s)`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Administrateurs',
          'Impossible de charger les administrateurs'
        )
        return this.handleError(error)
      })
    )
  }

 createAdmin(admin: CreateAdminRequest): Observable<User> {
    const loadingId = this.notificationService.loading(
      'Création de l\'administrateur...',
      `Création du compte pour ${admin.prenom} ${admin.nom}`
    );

    return this.http.post<User>(`${this.baseUrl}/admins`, admin).pipe(
      // keep the little UX delay you had
      switchMap(user => timer(800).pipe(switchMap(() => [user]))),
      tap((user) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Administrateur créé',
          `Compte créé pour ${user.prenom} ${user.nom} (${user.email})`
        );
      }),
      catchError((error) => {
        let errorMessage = 'Impossible de créer l\'administrateur';
        if (error.status === 409) {
          errorMessage = 'Un compte existe déjà avec cet email';
        } else if (error.status === 400) {
          errorMessage = 'Données invalides';
        }

        this.notificationService.operationError(
          loadingId,
          'Création administrateur',
          errorMessage
        );
        return this.handleError(error);
      })
    );
  }

  // Create encadrant -> POST /stages/admin/encadrants
  createEncadrant(encadrant: CreateEncadrantRequest): Observable<Encadrant> {
    const loadingId = this.notificationService.loading(
      'Création de l\'encadrant...',
      `Création du compte pour ${encadrant.prenom} ${encadrant.nom} (${encadrant.specialite || '—'})`
    );

    return this.http.post<Encadrant>(`${this.baseUrl}/encadrants`, encadrant).pipe(
      switchMap(user => timer(1000).pipe(switchMap(() => [user]))),
      tap(() => {
        this.notificationService.operationSuccess(
          loadingId,
          'Encadrant créé',
          `Compte créé pour ${encadrant.prenom} ${encadrant.nom} - Spécialité: ${encadrant.specialite || '—'}`
        );
      }),
      catchError((error) => {
        let errorMessage = 'Impossible de créer l\'encadrant';
        if (error.status === 409) {
          errorMessage = 'Un compte existe déjà avec cet email';
        } else if (error.status === 400) {
          errorMessage = 'Données invalides ou spécialité non reconnue';
        }

        this.notificationService.operationError(
          loadingId,
          'Création encadrant',
          errorMessage
        );
        return this.handleError(error);
      })
    );
  }

  // Delete admin -> DELETE /stages/admin/admins/{id}
  deleteAdmin(id: number): Observable<void> {
    const loadingId = this.notificationService.loading(
      'Suppression de l\'administrateur...',
      'Retrait du compte du système'
    );

    return this.http.delete<void>(`${this.baseUrl}/admins/${id}`).pipe(
      switchMap(response => timer(600).pipe(switchMap(() => [response]))),
      tap(() => {
        this.notificationService.operationSuccess(
          loadingId,
          'Administrateur supprimé',
          'Le compte a été retiré du système avec succès'
        );
      }),
      catchError((error) => {
        let errorMessage = 'Impossible de supprimer l\'administrateur';
        if (error.status === 409) {
          errorMessage = 'Impossible de supprimer: administrateur lié à des données';
        } else if (error.status === 403) {
          errorMessage = 'Vous ne pouvez pas supprimer ce compte';
        }

        this.notificationService.operationError(
          loadingId,
          'Suppression',
          errorMessage
        );
        return this.handleError(error);
      })
    );
  }

  // keep your existing handleError implementation
  // (removed duplicate handleError)

  createUser(user: Partial<User>): Observable<User> {
    const loadingId = this.notificationService.loading(
      'Création de l\'utilisateur...', 
      'Enregistrement des informations'
    )

    return this.http.post<User>(`${this.baseUrl}/admin/users`, user).pipe(
      switchMap(newUser => timer(600).pipe(switchMap(() => [newUser]))),
      
      tap((newUser) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Utilisateur créé',
          `Compte créé pour ${newUser.prenom} ${newUser.nom}`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Création utilisateur',
          'Impossible de créer l\'utilisateur'
        )
        return this.handleError(error)
      })
    )
  }

  updateUser(id: number, user: Partial<User>): Observable<User> {
    const loadingId = this.notificationService.loading(
      'Mise à jour de l\'utilisateur...', 
      'Sauvegarde des modifications'
    )

    return this.http.put<User>(`${this.baseUrl}/admin/users/${id}`, user).pipe(
      switchMap(updatedUser => timer(500).pipe(switchMap(() => [updatedUser]))),
      
      tap((updatedUser) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Utilisateur mis à jour',
          `Informations mises à jour pour ${updatedUser.prenom} ${updatedUser.nom}`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Mise à jour',
          'Impossible de mettre à jour l\'utilisateur'
        )
        return this.handleError(error)
      })
    )
  }

  deleteUser(id: number): Observable<void> {
    const loadingId = this.notificationService.loading(
      'Suppression de l\'utilisateur...', 
      'Retrait du système'
    )

    return this.http.delete<void>(`${this.baseUrl}/admin/users/${id}`).pipe(
      switchMap(response => timer(500).pipe(switchMap(() => [response]))),
      
      tap(() => {
        this.notificationService.operationSuccess(
          loadingId,
          'Utilisateur supprimé',
          'Le compte a été supprimé avec succès'
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Suppression',
          'Impossible de supprimer l\'utilisateur'
        )
        return this.handleError(error)
      })
    )
  }

  // ==================== BATCH OPERATIONS ====================

  batchCreateUsers(users: Partial<User>[]): Observable<User[]> {
    const operations = users.map((user, index) => `Création utilisateur ${index + 1}`)
    
    this.notificationService.batchOperation(operations, () => {
      this.notificationService.successWithBounce(
        'Création en lot terminée',
        `${users.length} utilisateurs créés avec succès`
      )
    })

    // Simulate batch creation
    return timer(users.length * 300).pipe(
      switchMap(() => this.http.post<User[]>(`${this.baseUrl}/admin/users/batch`, users)),
      catchError(this.handleError)
    )
  }

  batchDeleteUsers(ids: number[]): Observable<void> {
    const operations = ids.map(id => `Suppression utilisateur #${id}`)
    
    this.notificationService.batchOperation(operations, () => {
      this.notificationService.successWithBounce(
        'Suppression en lot terminée',
        `${ids.length} utilisateurs supprimés`
      )
    })

    return timer(ids.length * 200).pipe(
      switchMap(() => this.http.delete<void>(`${this.baseUrl}/admin/users/batch`, { body: ids })),
      catchError(this.handleError)
    )
  }

  // ==================== SEARCH AND FILTER ====================

  searchUsers(query: string, role?: string): Observable<User[]> {
    const loadingId = this.notificationService.loading(
      'Recherche en cours...', 
      `Recherche de "${query}"`
    )

    let params = new HttpParams().set('q', query)
    if (role) {
      params = params.set('role', role)
    }

    return this.http.get<User[]>(`${this.baseUrl}/admin/users/search`, { params }).pipe(
      switchMap(users => timer(400).pipe(switchMap(() => [users]))),
      
      tap((users) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Recherche',
          `${users.length} résultat(s) pour "${query}"`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Recherche',
          'Erreur lors de la recherche'
        )
        return this.handleError(error)
      })
    )
  }

  // ==================== USER STATISTICS ====================

  getUserStats(): Observable<any> {
    const loadingId = this.notificationService.loading(
      'Calcul des statistiques...', 
      'Analyse des données utilisateurs'
    )

    return this.http.get<any>(`${this.baseUrl}/admin/users/stats`).pipe(
      switchMap(stats => timer(500).pipe(switchMap(() => [stats]))),
      
      tap((stats) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Statistiques utilisateurs',
          `${stats.total} utilisateurs analysés`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Statistiques',
          'Impossible de calculer les statistiques'
        )
        return this.handleError(error)
      })
    )
  }

  // ==================== USER PROFILE MANAGEMENT ====================

  updateUserProfile(id: number, profileData: any): Observable<User> {
    const loadingId = this.notificationService.loading(
      'Mise à jour du profil...', 
      'Sauvegarde des modifications'
    )

    return this.http.put<User>(`${this.baseUrl}/admin/users/${id}/profile`, profileData).pipe(
      switchMap(user => timer(500).pipe(switchMap(() => [user]))),
      
      tap((user) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Profil mis à jour',
          `Profil de ${user.prenom} ${user.nom} mis à jour`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Mise à jour profil',
          'Impossible de mettre à jour le profil'
        )
        return this.handleError(error)
      })
    )
  }

  resetUserPassword(id: number): Observable<{ temporaryPassword: string }> {
    const loadingId = this.notificationService.loading(
      'Réinitialisation du mot de passe...', 
      'Génération d\'un nouveau mot de passe'
    )

    return this.http.post<{ temporaryPassword: string }>(`${this.baseUrl}/admin/users/${id}/reset-password`, {}).pipe(
      switchMap(response => timer(600).pipe(switchMap(() => [response]))),
      
      tap((response) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Mot de passe réinitialisé',
          `Nouveau mot de passe temporaire généré: ${response.temporaryPassword}`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Réinitialisation',
          'Impossible de réinitialiser le mot de passe'
        )
        return this.handleError(error)
      })
    )
  }

  // ==================== USER ACTIVATION/DEACTIVATION ====================

  activateUser(id: number): Observable<User> {
    const loadingId = this.notificationService.loading(
      'Activation du compte...', 
      'Réactivation de l\'utilisateur'
    )

    return this.http.put<User>(`${this.baseUrl}/admin/users/${id}/activate`, {}).pipe(
      switchMap(user => timer(400).pipe(switchMap(() => [user]))),
      
      tap((user) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Compte activé',
          `${user.prenom} ${user.nom} peut maintenant se connecter`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Activation',
          'Impossible d\'activer le compte'
        )
        return this.handleError(error)
      })
    )
  }

  deactivateUser(id: number): Observable<User> {
    const loadingId = this.notificationService.loading(
      'Désactivation du compte...', 
      'Suspension de l\'accès utilisateur'
    )

    return this.http.put<User>(`${this.baseUrl}/admin/users/${id}/deactivate`, {}).pipe(
      switchMap(user => timer(400).pipe(switchMap(() => [user]))),
      
      tap((user) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Compte désactivé',
          `Accès suspendu pour ${user.prenom} ${user.nom}`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Désactivation',
          'Impossible de désactiver le compte'
        )
        return this.handleError(error)
      })
    )
  }

  // ==================== BULK OPERATIONS ====================

  bulkUpdateUsers(updates: { id: number, data: Partial<User> }[]): Observable<User[]> {
    const loadingId = this.notificationService.loading(
      'Mise à jour en lot...', 
      `Modification de ${updates.length} utilisateur(s)`
    )

    return this.http.put<User[]>(`${this.baseUrl}/admin/users/bulk-update`, updates).pipe(
      switchMap(users => timer(updates.length * 200).pipe(switchMap(() => [users]))),
      
      tap((users) => {
        this.notificationService.operationSuccess(
          loadingId,
          'Mise à jour en lot',
          `${users.length} utilisateur(s) mis à jour avec succès`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Mise à jour en lot',
          'Erreur lors de la mise à jour en lot'
        )
        return this.handleError(error)
      })
    )
  }

  // ==================== EXPORT/IMPORT ====================

  exportUsers(format: 'csv' | 'excel' | 'pdf' = 'csv'): Observable<Blob> {
    const loadingId = this.notificationService.loading(
      'Export en cours...', 
      `Génération du fichier ${format.toUpperCase()}`
    )

    return this.http.get(`${this.baseUrl}/admin/users/export`, {
      params: { format },
      responseType: 'blob'
    }).pipe(
      switchMap(blob => timer(800).pipe(switchMap(() => [blob]))),
      
      tap(() => {
        this.notificationService.operationSuccess(
          loadingId,
          'Export terminé',
          `Fichier ${format.toUpperCase()} généré avec succès`
        )
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Export',
          'Impossible de générer le fichier d\'export'
        )
        return this.handleError(error)
      })
    )
  }

  importUsers(file: File): Observable<{ success: number, errors: string[] }> {
    const formData = new FormData()
    formData.append('file', file)

    const loadingId = this.notificationService.loading(
      'Import en cours...', 
      `Traitement de ${file.name}`
    )

    return this.http.post<{ success: number, errors: string[] }>(
      `${this.baseUrl}/admin/users/import`, 
      formData
    ).pipe(
      switchMap(result => timer(1200).pipe(switchMap(() => [result]))),
      
      tap((result) => {
        if (result.errors.length === 0) {
          this.notificationService.operationSuccess(
            loadingId,
            'Import réussi',
            `${result.success} utilisateur(s) importé(s) avec succès`
          )
        } else {
          this.notificationService.remove(loadingId)
          this.notificationService.warning(
            'Import partiellement réussi',
            `${result.success} utilisateur(s) importé(s), ${result.errors.length} erreur(s)`,
            8000,
            [{
              label: 'Voir les erreurs',
              style: 'warning',
              action: () => {
                // console.log('Import errors:', result.errors)
                this.notificationService.error(
                  'Erreurs d\'import',
                  result.errors.join('\n')
                )
              }
            }]
          )
        }
      }),
      
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          'Import',
          'Impossible d\'importer le fichier'
        )
        return this.handleError(error)
      })
    )
  }

  // ==================== UTILITY METHODS ====================

  private getRoleLabel(role: string): string {
    const roleLabels: { [key: string]: string } = {
      'ETUDIANT': 'Étudiants',
      'ENCADRANT': 'Encadrants',
      'ADMIN': 'Administrateurs'
    }
    return roleLabels[role] || role
  }

  private handleError = (error: any): Observable<never> => {
    // console.error("🚨 UserService error:", error)
    
    let errorMessage = "Une erreur est survenue"

    if (error.status === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter."
    } else if (error.status === 403) {
      errorMessage = "Accès refusé."
    } else if (error.status === 404) {
      errorMessage = "Utilisateur non trouvé."
    } else if (error.status === 409) {
      errorMessage = "Conflit: données déjà existantes."
    } else if (error.status === 0) {
      errorMessage = "Impossible de se connecter au serveur."
    } else if (error.error?.message) {
      errorMessage = error.error.message
    }

    return throwError(() => new Error(errorMessage))
  }

  // ==================== PERFORMANCE MONITORING ====================


   getServiceHealth(): Observable<{ status: string, responseTime: number }> {
  const startTime = Date.now();
  
  return this.http.get<{ status: string }>(`${this.baseUrl}/health`).pipe(
    map((response) => ({
      ...response,
      responseTime: Date.now() - startTime
    })),
    
    tap((health) => {
      if (health.responseTime > 2000) {
        this.notificationService.warning(
          'Performance dégradée',
          `Temps de réponse élevé: ${health.responseTime}ms`
        );
      }
    }),
    
    catchError((error) => {
      this.notificationService.error(
        'Service indisponible',
        'Le service utilisateurs ne répond pas'
      );
      return throwError(() => error);
    })
  );
}




// returns the updated Encadrant DTO coming from backend
updateEncadrant(id: number, payload: Partial<EncadrantDto & { telephone?:string, email?:string }>): Observable<EncadrantDto> {
  const loadingId = this.notificationService.loading(
    'Mise à jour de l\'encadrant...',
    'Sauvegarde des modifications'
  );

  return this.http.put<EncadrantDto>(`${this.baseUrl}/encadrants/${id}`, payload).pipe(
    switchMap(updated => timer(400).pipe(switchMap(() => [updated]))),
    tap((updated) => {
      this.notificationService.operationSuccess(
        loadingId,
        'Encadrant mis à jour',
        `${updated.prenom} ${updated.nom} mis à jour`
      );
    }),
    catchError((error) => {
      this.notificationService.operationError(
        loadingId,
        'Mise à jour encadrant',
        'Impossible de mettre à jour l\'encadrant'
      );
      return this.handleError(error);
    })
  );
}

  

getEncadrantById(id: number): Observable<EncadrantDto> {
  const loadingId = this.notificationService.loading('Chargement encadrant...', 'Récupération détails');
  return this.http.get<EncadrantDto>(`${this.baseUrl}/encadrants/${id}`).pipe(
    switchMap(enc => timer(300).pipe(switchMap(() => [enc]))),
    tap(enc => this.notificationService.operationSuccess(loadingId, 'Encadrant', `Détails chargés pour ${enc.prenom} ${enc.nom}`)),
    catchError((err) => {
      this.notificationService.operationError(loadingId, 'Encadrant', 'Impossible de charger l\'encadrant');
      return this.handleError(err);
    })
  );
}


  refreshAllData(): Observable<any> {
    const loadingId = this.notificationService.loading(
      'Actualisation des données...', 
      'Rechargement complet'
    )

    return timer(1000).pipe(
      tap(() => {
        this.notificationService.operationSuccess(
          loadingId,
          'Données actualisées',
          'Toutes les données ont été rechargées'
        )
      })
    )
  }
}