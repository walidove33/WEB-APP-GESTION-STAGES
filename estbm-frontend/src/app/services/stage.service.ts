


// import { Injectable } from "@angular/core"
// import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
// import { Observable, throwError, timer } from "rxjs"
// import { catchError, tap, switchMap, map } from "rxjs/operators"
// import { NotificationService } from "./notification.service"
// import { environment } from "../../app/environement"
// import {
//   Stage,
//   StageRequest,
//   Rapport,
//   RapportDetails,
//   DecisionDto,
//   AssignmentRequest,
//   GroupAssignmentRequest,
//   CommentaireRapport,
//   PlanificationSoutenanceResponse,
//   DetailSoutenance,
//   SoutenanceEtudiantSlotDto,
// } from "../models/stage.model"

// @Injectable({
//   providedIn: "root",
// })
// export class StageService {
// private baseUrl = `${environment.apiUrl}/stages`; // -> "http://localhost:8081/stages"

//   constructor(
//     private http: HttpClient,
//     private notificationService: NotificationService,
//   ) {}

//   // ==================== STAGE MANAGEMENT ====================

//   getMyStages(): Observable<Stage[]> {
//     const loadingId = this.notificationService.loading("Chargement de vos stages...", "Récupération de votre historique")

//     return this.http.get<Stage[]>(`${this.baseUrl}/etudiants/mes-stages`).pipe(
//       switchMap((stages) => timer(400).pipe(switchMap(() => [stages]))),
//       tap((stages) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Stages chargés",
//           `${stages.length} stage(s) trouvé(s) dans votre historique`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Chargement stages", "Impossible de charger vos stages")
//         return this.handleError(error)
//       }),
//     )
//   }

//   getMyAssignedStages(): Observable<Stage[]> {
//     const loadingId = this.notificationService.loading(
//       "Chargement de vos stages assignés...",
//       "Récupération des stages sous votre supervision",
//     )

//     return this.http.get<Stage[]>(`${this.baseUrl}/encadrants/me/stages`).pipe(
//       switchMap((stages) => timer(300).pipe(switchMap(() => [stages]))),
//       tap((stages) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Stages assignés",
//           `${stages.length} stage(s) sous votre supervision`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           "Stages assignés",
//           "Impossible de charger vos stages assignés",
//         )
//         return this.handleError(error)
//       }),
//     )
//   }

//   // StageService (ajoute vers le haut avec les autres méthodes)
// listEncadrants(): Observable<Array<{ id: number; utilisateurId: number; nom?: string; prenom?: string }>> {
//   return this.http.get<Array<{ id: number; utilisateurId: number; nom?: string; prenom?: string }>>(
//     `${this.baseUrl}/admin/encadrants`
//   ).pipe(
//     catchError((error) => {
//       console.error('Erreur loading encadrants:', error);
//       return this.handleError(error);
//     })
//   );
// }


//   getAllStages(): Observable<Stage[]> {
//     const loadingId = this.notificationService.loading("Chargement de tous les stages...", "Récupération complète")

//     return this.http.get<Stage[]>(`${this.baseUrl}/admin/stages`).pipe(
//       switchMap((stages) => timer(500).pipe(switchMap(() => [stages]))),
//       tap((stages) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Tous les stages",
//           `${stages.length} stage(s) dans le système`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Tous les stages", "Impossible de charger tous les stages")
//         return this.handleError(error)
//       }),
//     )
//   }

//   createDemande(stageData: StageRequest): Observable<Stage> {
//     const loadingId = this.notificationService.loading(
//       "Création de votre demande...",
//       `Stage chez ${stageData.entreprise}`,
//     )

//     return this.http.post<Stage>(`${this.baseUrl}/etudiants/demande`, stageData).pipe(
//       switchMap((stage) => timer(800).pipe(switchMap(() => [stage]))),
//       tap((stage) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Demande créée",
//           `Votre demande de stage chez ${stage.entreprise} a été soumise avec succès`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Création demande", "Impossible de créer votre demande")
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== PLANIFICATION MANAGEMENT ====================

//   getAllPlanifications(): Observable<PlanificationSoutenanceResponse[]> {
//     const loadingId = this.notificationService.loading(
//       "Chargement des planifications...",
//       "Récupération de toutes les planifications",
//     )

//     return this.http.get<PlanificationSoutenanceResponse[]>(`${this.baseUrl}/planification/all`).pipe(
//       tap((planifications) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Planifications",
//           `${planifications.length} planification(s) chargée(s)`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           "Planifications",
//           "Impossible de charger les planifications",
//         )
//         return this.handleError(error)
//       }),
//     )
//   }

//   createPlanification(planificationData: any): Observable<PlanificationSoutenanceResponse> {
//     const loadingId = this.notificationService.loading(
//       "Création de la planification...",
//       "Enregistrement de la nouvelle planification",
//     )

//     console.log("🚀 Creating planification with data:", planificationData)

//     // Construire le payload correct selon l'API backend
//     const payload = {
//     dateSoutenance: planificationData?.dateSoutenance,
//     encadrantId: Number(planificationData?.encadrant?.id ?? planificationData?.encadrantId ?? 0) || null,
//     departementId: Number(planificationData?.departement?.id ?? planificationData?.departementId ?? 0) || null,
//     classeGroupeId: Number(planificationData?.classeGroupe?.id ?? planificationData?.classeGroupeId ?? 0) || null,
//     anneeScolaireId: Number(planificationData?.anneeScolaire?.id ?? planificationData?.anneeScolaireId ?? 0) || null,
//   };

//     console.log("📤 Sending payload:", payload)
// return this.http.post<PlanificationSoutenanceResponse>(
//   `${this.baseUrl}/planification/create`, payload
// ).pipe(
//       tap((response) => {
//         console.log("✅ Planification created successfully:", response)
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Planification créée",
//           `Planification du ${response.dateSoutenance} créée avec succès`,
//         )
//       }),
//       catchError((error) => {
//         console.error("❌ Error creating planification:", error)
//         this.notificationService.operationError(
//           loadingId,
//           "Création planification",
//           "Impossible de créer la planification",
//         )
//         return this.handleError(error)
//       }),
//     )
//   }

//   getPlanificationsByEncadrant(encadrantId: number): Observable<PlanificationSoutenanceResponse[]> {
//     const loadingId = this.notificationService.loading(
//       "Chargement de vos planifications...",
//       "Récupération des planifications assignées",
//     )

//     return this.http.get<PlanificationSoutenanceResponse[]>(`${this.baseUrl}/planification/encadrant/${encadrantId}`).pipe(
//       tap((planifications) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Mes planifications",
//           `${planifications.length} planification(s) trouvée(s)`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           "Mes planifications",
//           "Impossible de charger vos planifications",
//         )
//         return this.handleError(error)
//       }),
//     )
//   }

//   getPlanificationDetails(planifId: number): Observable<DetailSoutenance[]> {
//     const loadingId = this.notificationService.loading(
//       "Chargement des créneaux...",
//       "Récupération des détails de planification",
//     )

//     return this.http.get<DetailSoutenance[]>(`${this.baseUrl}/planification/${planifId}/details`).pipe(
//       tap((details) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Créneaux",
//           `${details.length} créneau(x) trouvé(s)`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Créneaux", "Impossible de charger les créneaux")
//         return this.handleError(error)
//       }),
//     )
//   }

//   addDetailToPlanification(planifId: number, detail: DetailSoutenance): Observable<DetailSoutenance> {
//     const loadingId = this.notificationService.loading(
//       "Ajout du créneau...",
//       "Enregistrement du nouveau créneau de soutenance",
//     )

//     return this.http.post<DetailSoutenance>(`${this.baseUrl}/planification/${planifId}/addDetail`, detail).pipe(
//       tap((newDetail) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Créneau ajouté",
//           `Nouveau créneau créé: ${newDetail.heureDebut} - ${newDetail.heureFin}`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Ajout créneau", "Impossible d'ajouter le créneau")
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== SOUTENANCE MANAGEMENT ====================

//   getMySoutenances(etudiantId: number): Observable<SoutenanceEtudiantSlotDto[]> {
//     const loadingId = this.notificationService.loading(
//       "Chargement de vos soutenances...",
//       "Récupération de vos créneaux programmés",
//     )

//     return this.http.get<SoutenanceEtudiantSlotDto[]>(`${this.baseUrl}/planification/etudiant/${etudiantId}`).pipe(
//       tap((soutenances) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Mes soutenances",
//           `${soutenances.length} soutenance(s) programmée(s)`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           "Mes soutenances",
//           "Impossible de charger vos soutenances",
//         )
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== RAPPORT MANAGEMENT ====================

//   getRapportsForEncadrant(): Observable<RapportDetails[]> {
//     const loadingId = this.notificationService.loading(
//       "Chargement des rapports...",
//       "Récupération des rapports de vos étudiants",
//     )

//     return this.http.get<RapportDetails[]>(`${this.baseUrl}/encadrants/me/rapports/details`).pipe(
//       tap((rapports) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Rapports",
//           `${rapports.length} rapport(s) trouvé(s)`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Rapports", "Impossible de charger les rapports")
//         return this.handleError(error)
//       }),
//     )
//   }

//   getExistingRapport(stageId: number): Observable<Rapport | null> {
//     return this.http.get<Rapport>(`${this.baseUrl}/etudiants/${stageId}/existing`).pipe(
//       catchError(() => {
//         return [null] // Return null if no report exists
//       }),
//     )
//   }

//   submitRapport(stageId: number, file: File): Observable<string> {
//     const formData = new FormData()
//     formData.append("file", file)

//     const loadingId = this.notificationService.loading(
//       "Soumission du rapport...",
//       `Upload de ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
//     )

//     return this.http.post<string>(`${this.baseUrl}/rapports/${stageId}`, formData).pipe(
//       switchMap((response) => timer(1000).pipe(switchMap(() => [response]))),
//       tap((response) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Rapport soumis",
//           "Votre rapport a été soumis avec succès et est en attente de validation",
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Soumission rapport", "Impossible de soumettre le rapport")
//         return this.handleError(error)
//       }),
//     )
//   }

//   downloadRapport(stageId: number): Observable<HttpResponse<Blob>> {
//     const loadingId = this.notificationService.loading("Téléchargement du rapport...", "Préparation du fichier")

//     return this.http
//       .get(`${this.baseUrl}/rapports/${stageId}/download`, {
//         responseType: "blob",
//         observe: "response",
//       })
//       .pipe(
//         tap(() => {
//           this.notificationService.operationSuccess(loadingId, "Téléchargement", "Rapport téléchargé avec succès")
//         }),
//         catchError((error) => {
//           this.notificationService.operationError(
//             loadingId,
//             "Téléchargement",
//             "Impossible de télécharger le rapport",
//           )
//           return this.handleError(error)
//         }),
//       )
//   }

//   validateRapport(rapportId: number, commentaire?: string): Observable<Rapport> {
//     const loadingId = this.notificationService.loading("Validation du rapport...", "Enregistrement de votre décision")

//     const body = commentaire ? { commentaire } : {}

//     return this.http.put<Rapport>(`${this.baseUrl}/rapports/${rapportId}/validate`, body).pipe(
//       tap(() => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Rapport validé",
//           commentaire ? "Rapport validé avec commentaire" : "Rapport validé sans commentaire",
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Validation", "Impossible de valider le rapport")
//         return this.handleError(error)
//       }),
//     )
//   }

//   rejectRapport(rapportId: number, commentaire: string): Observable<Rapport> {
//     const loadingId = this.notificationService.loading("Rejet du rapport...", "Enregistrement de votre décision")

//     return this.http.put<Rapport>(`${this.baseUrl}/rapports/${rapportId}/reject`, { commentaire }).pipe(
//       tap(() => {
//         this.notificationService.operationSuccess(loadingId, "Rapport rejeté", "Rapport rejeté avec commentaire")
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Rejet", "Impossible de rejeter le rapport")
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== DECISION MANAGEMENT ====================

//   getMesDemandes(): Observable<Stage[]> {
//     const loadingId = this.notificationService.loading(
//       "Chargement de vos demandes...",
//       "Récupération des demandes en attente",
//     )

//     return this.http.get<Stage[]>(`${this.baseUrl}/encadrants/me/demandes`).pipe(
//       tap((demandes) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Demandes",
//           `${demandes.length} demande(s) en attente de votre validation`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Demandes", "Impossible de charger vos demandes")
//         return this.handleError(error)
//       }),
//     )
//   }

//   approveDecision(dto: DecisionDto): Observable<{ message: string }> {
//     const loadingId = this.notificationService.loading("Approbation en cours...", "Validation de la demande")

//     return this.http.post<{ message: string }>(`${this.baseUrl}/encadrants/decision`, dto).pipe(
//       tap((response) => {
//         this.notificationService.operationSuccess(loadingId, "Demande approuvée", response.message)
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Approbation", "Impossible d'approuver la demande")
//         return this.handleError(error)
//       }),
//     )
//   }

//   rejectStage(stageId: number, raison: string): Observable<string> {
//     const dto: DecisionDto = { idStage: stageId, approuver: false }
//     const loadingId = this.notificationService.loading("Rejet en cours...", "Enregistrement du refus")

//     return this.http.post<{ message: string }>(`${this.baseUrl}/encadrants/decision`, dto).pipe(
//       map((response) => response.message),
//       tap((message) => {
//         this.notificationService.operationSuccess(loadingId, "Demande rejetée", message)
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Rejet", "Impossible de rejeter la demande")
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== ASSIGNMENT MANAGEMENT ====================

//   getAssignments(): Observable<any[]> {
//     const loadingId = this.notificationService.loading("Chargement des affectations...", "Récupération des associations")

//     return this.http.get<any[]>(`${this.baseUrl}/admin/assignments`).pipe(
//       tap((assignments) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Affectations",
//           `${assignments.length} affectation(s) trouvée(s)`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Affectations", "Impossible de charger les affectations")
//         return this.handleError(error)
//       }),
//     )
//   }

//   assignerEncadrantGroupe(request: GroupAssignmentRequest): Observable<{ message: string }> {
//     const loadingId = this.notificationService.loading(
//       "Affectation par groupe...",
//       "Attribution de l'encadrant au groupe sélectionné",
//     )

//     console.log("🎯 Group assignment request:", request)

//     return this.http.post<{ message: string }>(`${this.baseUrl}/admin/assigner-encadrant-groupe`, request).pipe(
//       tap((response) => {
//         console.log("✅ Group assignment successful:", response)
//         this.notificationService.operationSuccess(loadingId, "Affectation réussie", response.message)
//       }),
//       catchError((error) => {
//         console.error("❌ Group assignment failed:", error)
//         this.notificationService.operationError(loadingId, "Affectation", "Impossible d'affecter l'encadrant au groupe")
//         return this.handleError(error)
//       }),
//     )
//   }

//   removeAssignment(assignmentId: number): Observable<void> {
//     const loadingId = this.notificationService.loading("Suppression de l'affectation...", "Retrait de l'association")

//     return this.http.delete<void>(`${this.baseUrl}/admin/assignments/${assignmentId}`).pipe(
//       tap(() => {
//         this.notificationService.operationSuccess(loadingId, "Affectation supprimée", "Association retirée avec succès")
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(
//           loadingId,
//           "Suppression",
//           "Impossible de supprimer l'affectation",
//         )
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== REFERENCE DATA ====================

//   listDepartements(): Observable<Array<{ id: number; nom: string }>> {
//     return this.http.get<Array<{ id: number; nom: string }>>(`${this.baseUrl}/admin/departements`).pipe(
//       catchError((error) => {
//         console.error("Error loading departements:", error)
//         return this.handleError(error)
//       }),
//     )
//   }

//   listClassGroups(departementId: number): Observable<Array<{ id: number; nom: string }>> {
//     return this.http
//       .get<Array<{ id: number; nom: string }>>(`${this.baseUrl}/admin/departements/${departementId}/class-groups`)
//       .pipe(
//         catchError((error) => {
//           console.error("Error loading class groups:", error)
//           return this.handleError(error)
//         }),
//       )
//   }

//   listAllClassGroups(): Observable<Array<{ id: number; nom: string }>> {
//     return this.http.get<Array<{ id: number; nom: string }>>(`${this.baseUrl}/admin/class-groups`).pipe(
//       catchError((error) => {
//         console.error("Error loading all class groups:", error)
//         return this.handleError(error)
//       }),
//     )
//   }

//   listAnneesScolaires(): Observable<Array<{ id: number; libelle: string }>> {
//     return this.http.get<Array<{ id: number; libelle: string }>>(`${this.baseUrl}/admin/annee-scolaires`).pipe(
//       catchError((error) => {
//         console.error("Error loading school years:", error)
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== STATISTICS ====================

//   getStageStats(): Observable<any> {
//     const loadingId = this.notificationService.loading("Calcul des statistiques...", "Analyse des données")

//     return this.http.get<any>(`${this.baseUrl}/admin/statistiques`).pipe(
//       tap((stats) => {
//         this.notificationService.operationSuccess(
//           loadingId,
//           "Statistiques",
//           `${stats.total} stages analysés`,
//         )
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Statistiques", "Impossible de calculer les statistiques")
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== DOCUMENT MANAGEMENT ====================

//   downloadConvention(stageId: number): Observable<Blob> {
//     const loadingId = this.notificationService.loading("Téléchargement convention...", "Génération du document")

//     return this.http.get(`${this.baseUrl}/stages/convention?idStage=${stageId}`, { responseType: "blob" }).pipe(
//       tap(() => {
//         this.notificationService.operationSuccess(loadingId, "Convention", "Document téléchargé avec succès")
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Convention", "Impossible de télécharger la convention")
//         return this.handleError(error)
//       }),
//     )
//   }

//   downloadAssurance(stageId: number): Observable<Blob> {
//     const loadingId = this.notificationService.loading("Téléchargement assurance...", "Génération du document")

//     return this.http.get(`${this.baseUrl}/stages/assurance?idStage=${stageId}`, { responseType: "blob" }).pipe(
//       tap(() => {
//         this.notificationService.operationSuccess(loadingId, "Assurance", "Document téléchargé avec succès")
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Assurance", "Impossible de télécharger l'assurance")
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== COMMENT MANAGEMENT ====================

//   listCommentaires(etudiantFilter?: string): Observable<CommentaireRapport[]> {
//     let params = new HttpParams()
//     if (etudiantFilter) {
//       params = params.set("etudiant", etudiantFilter)
//     }

//     return this.http.get<CommentaireRapport[]>(`${this.baseUrl}/encadrants/me/commentaires`, { params }).pipe(
//       catchError((error) => {
//         console.error("Error loading comments:", error)
//         return this.handleError(error)
//       }),
//     )
//   }

//   addComment(rapportId: number, texte: string): Observable<CommentaireRapport> {
//     const loadingId = this.notificationService.loading("Ajout du commentaire...", "Enregistrement de votre commentaire")

//     return this.http.post<CommentaireRapport>(`${this.baseUrl}/encadrants/${rapportId}/commentaire`, { texte }).pipe(
//       tap(() => {
//         this.notificationService.operationSuccess(loadingId, "Commentaire ajouté", "Votre commentaire a été enregistré")
//       }),
//       catchError((error) => {
//         this.notificationService.operationError(loadingId, "Commentaire", "Impossible d'ajouter le commentaire")
//         return this.handleError(error)
//       }),
//     )
//   }

//   // ==================== ERROR HANDLING ====================

//   private handleError(error: any): Observable<never> {
//     console.error("🚨 StageService error:", error)

//     let errorMessage = "Une erreur est survenue"

//     if (error.status === 401) {
//       errorMessage = "Session expirée. Veuillez vous reconnecter."
//     } else if (error.status === 403) {
//       errorMessage = "Accès refusé."
//     } else if (error.status === 404) {
//       errorMessage = "Ressource non trouvée."
//     } else if (error.status === 409) {
//       errorMessage = "Conflit: données déjà existantes."
//     } else if (error.status === 0) {
//       errorMessage = "Impossible de se connecter au serveur."
//     } else if (error.error?.message) {
//       errorMessage = error.error.message
//     }

//     return throwError(() => new Error(errorMessage))
//   }
// }




import { Injectable } from "@angular/core"
import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http"
import { Observable, throwError, timer } from "rxjs"
import { catchError, tap, switchMap, map } from "rxjs/operators"
import { NotificationService } from "./notification.service"
import { environment } from "../../app/environement"
import {
  Stage,
  StageRequest,
  Rapport,
  RapportDetails,
  DecisionDto,
  AssignmentRequest,
  GroupAssignmentRequest,
  CommentaireRapport,
  PlanificationSoutenanceResponse,
  DetailSoutenance,
  SoutenanceEtudiantSlotDto,
} from "../models/stage.model"

@Injectable({
  providedIn: "root",
})
export class StageService {
private baseUrl = `${environment.apiUrl}/stages`; // -> "http://localhost:8081/stages"

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService,
  ) {}

  // ==================== STAGE MANAGEMENT ====================

  getMyStages(): Observable<Stage[]> {
    const loadingId = this.notificationService.loading("Chargement de vos stages...", "Récupération de votre historique")

    return this.http.get<Stage[]>(`${this.baseUrl}/etudiants/mes-stages`).pipe(
      switchMap((stages) => timer(400).pipe(switchMap(() => [stages]))),
      tap((stages) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Stages chargés",
          `${stages.length} stage(s) trouvé(s) dans votre historique`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Chargement stages", "Impossible de charger vos stages")
        return this.handleError(error)
      }),
    )
  }

  getMyAssignedStages(): Observable<Stage[]> {
    const loadingId = this.notificationService.loading(
      "Chargement de vos stages assignés...",
      "Récupération des stages sous votre supervision",
    )

    return this.http.get<Stage[]>(`${this.baseUrl}/encadrants/me/stages`).pipe(
      switchMap((stages) => timer(300).pipe(switchMap(() => [stages]))),
      tap((stages) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Stages assignés",
          `${stages.length} stage(s) sous votre supervision`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          "Stages assignés",
          "Impossible de charger vos stages assignés",
        )
        return this.handleError(error)
      }),
    )
  }

  // StageService (ajoute vers le haut avec les autres méthodes)
listEncadrants(): Observable<Array<{ id: number; utilisateurId: number; nom?: string; prenom?: string }>> {
  return this.http.get<Array<{ id: number; utilisateurId: number; nom?: string; prenom?: string }>>(
    `${this.baseUrl}/admin/encadrants`
  ).pipe(
    catchError((error) => {
      console.error('Erreur loading encadrants:', error);
      return this.handleError(error);
    })
  );
}


  getAllStages(): Observable<Stage[]> {
    const loadingId = this.notificationService.loading("Chargement de tous les stages...", "Récupération complète")

    return this.http.get<Stage[]>(`${this.baseUrl}/admin/stages`).pipe(
      switchMap((stages) => timer(500).pipe(switchMap(() => [stages]))),
      tap((stages) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Tous les stages",
          `${stages.length} stage(s) dans le système`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Tous les stages", "Impossible de charger tous les stages")
        return this.handleError(error)
      }),
    )
  }

  createDemande(stageData: StageRequest): Observable<Stage> {
    const loadingId = this.notificationService.loading(
      "Création de votre demande...",
      `Stage chez ${stageData.entreprise}`,
    )

    return this.http.post<Stage>(`${this.baseUrl}/etudiants/demande`, stageData).pipe(
      switchMap((stage) => timer(800).pipe(switchMap(() => [stage]))),
      tap((stage) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Demande créée",
          `Votre demande de stage chez ${stage.entreprise} a été soumise avec succès`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Création demande", "Impossible de créer votre demande")
        return this.handleError(error)
      }),
    )
  }

  // ==================== PLANIFICATION MANAGEMENT ====================

  getAllPlanifications(): Observable<PlanificationSoutenanceResponse[]> {
    const loadingId = this.notificationService.loading(
      "Chargement des planifications...",
      "Récupération de toutes les planifications",
    )

    return this.http.get<PlanificationSoutenanceResponse[]>(`${this.baseUrl}/planification/all`).pipe(
      tap((planifications) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Planifications",
          `${planifications.length} planification(s) chargée(s)`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          "Planifications",
          "Impossible de charger les planifications",
        )
        return this.handleError(error)
      }),
    )
  }

  createPlanification(planificationData: any): Observable<PlanificationSoutenanceResponse> {
    const loadingId = this.notificationService.loading(
      "Création de la planification...",
      "Enregistrement de la nouvelle planification",
    )

    console.log("🚀 Creating planification with data:", planificationData)

    // Construire le payload correct selon l'API backend
    const payload = {
    dateSoutenance: planificationData?.dateSoutenance,
    encadrantId: Number(planificationData?.encadrant?.id ?? planificationData?.encadrantId ?? 0) || null,
    departementId: Number(planificationData?.departement?.id ?? planificationData?.departementId ?? 0) || null,
    classeGroupeId: Number(planificationData?.classeGroupe?.id ?? planificationData?.classeGroupeId ?? 0) || null,
    anneeScolaireId: Number(planificationData?.anneeScolaire?.id ?? planificationData?.anneeScolaireId ?? 0) || null,
  };

    console.log("📤 Sending payload:", payload)
return this.http.post<PlanificationSoutenanceResponse>(
  `${this.baseUrl}/planification/create`, payload
).pipe(
      tap((response) => {
        console.log("✅ Planification created successfully:", response)
        this.notificationService.operationSuccess(
          loadingId,
          "Planification créée",
          `Planification du ${response.dateSoutenance} créée avec succès`,
        )
      }),
      catchError((error) => {
        console.error("❌ Error creating planification:", error)
        this.notificationService.operationError(
          loadingId,
          "Création planification",
          "Impossible de créer la planification",
        )
        return this.handleError(error)
      }),
    )
  }

  getPlanificationsByEncadrant(encadrantId: number): Observable<PlanificationSoutenanceResponse[]> {
    const loadingId = this.notificationService.loading(
      "Chargement de vos planifications...",
      "Récupération des planifications assignées",
    )

    return this.http.get<PlanificationSoutenanceResponse[]>(`${this.baseUrl}/planification/encadrant/${encadrantId}`).pipe(
      tap((planifications) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Mes planifications",
          `${planifications.length} planification(s) trouvée(s)`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          "Mes planifications",
          "Impossible de charger vos planifications",
        )
        return this.handleError(error)
      }),
    )
  }

  getPlanificationDetails(planifId: number): Observable<DetailSoutenance[]> {
    const loadingId = this.notificationService.loading(
      "Chargement des créneaux...",
      "Récupération des détails de planification",
    )

    return this.http.get<DetailSoutenance[]>(`${this.baseUrl}/planification/${planifId}/details`).pipe(
      tap((details) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Créneaux",
          `${details.length} créneau(x) trouvé(s)`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Créneaux", "Impossible de charger les créneaux")
        return this.handleError(error)
      }),
    )
  }

  addDetailToPlanification(planifId: number, detail: DetailSoutenance): Observable<DetailSoutenance> {
    const loadingId = this.notificationService.loading(
      "Ajout du créneau...",
      "Enregistrement du nouveau créneau de soutenance",
    )

    return this.http.post<DetailSoutenance>(`${this.baseUrl}/planification/${planifId}/addDetail`, detail).pipe(
      tap((newDetail) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Créneau ajouté",
          `Nouveau créneau créé: ${newDetail.heureDebut} - ${newDetail.heureFin}`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Ajout créneau", "Impossible d'ajouter le créneau")
        return this.handleError(error)
      }),
    )
  }

  // ==================== SOUTENANCE MANAGEMENT ====================

  getMySoutenances(etudiantId: number): Observable<SoutenanceEtudiantSlotDto[]> {
    const loadingId = this.notificationService.loading(
      "Chargement de vos soutenances...",
      "Récupération de vos créneaux programmés",
    )

    return this.http.get<SoutenanceEtudiantSlotDto[]>(`${this.baseUrl}/planification/etudiant/${etudiantId}`).pipe(
      tap((soutenances) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Mes soutenances",
          `${soutenances.length} soutenance(s) programmée(s)`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          "Mes soutenances",
          "Impossible de charger vos soutenances",
        )
        return this.handleError(error)
      }),
    )
  }

  // ==================== RAPPORT MANAGEMENT ====================

  getRapportsForEncadrant(): Observable<RapportDetails[]> {
    const loadingId = this.notificationService.loading(
      "Chargement des rapports...",
      "Récupération des rapports de vos étudiants",
    )

    return this.http.get<RapportDetails[]>(`${this.baseUrl}/encadrants/me/rapports/details`).pipe(
      tap((rapports) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Rapports",
          `${rapports.length} rapport(s) trouvé(s)`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Rapports", "Impossible de charger les rapports")
        return this.handleError(error)
      }),
    )
  }

  getExistingRapport(stageId: number): Observable<Rapport | null> {
    return this.http.get<Rapport>(`${this.baseUrl}/etudiants/${stageId}/existing`).pipe(
      catchError(() => {
        return [null] // Return null if no report exists
      }),
    )
  }

  submitRapport(stageId: number, file: File): Observable<string> {
    const formData = new FormData()
    formData.append("file", file)

    const loadingId = this.notificationService.loading(
      "Soumission du rapport...",
      `Upload de ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)`,
    )

    return this.http.post<string>(`${this.baseUrl}/rapports/${stageId}`, formData).pipe(
      switchMap((response) => timer(1000).pipe(switchMap(() => [response]))),
      tap((response) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Rapport soumis",
          "Votre rapport a été soumis avec succès et est en attente de validation",
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Soumission rapport", "Impossible de soumettre le rapport")
        return this.handleError(error)
      }),
    )
  }

  downloadRapport(stageId: number): Observable<HttpResponse<Blob>> {
    const loadingId = this.notificationService.loading("Téléchargement du rapport...", "Préparation du fichier")

    return this.http
      .get(`${this.baseUrl}/rapports/${stageId}/download`, {
        responseType: "blob",
        observe: "response",
      })
      .pipe(
        tap(() => {
          this.notificationService.operationSuccess(loadingId, "Téléchargement", "Rapport téléchargé avec succès")
        }),
        catchError((error) => {
          this.notificationService.operationError(
            loadingId,
            "Téléchargement",
            "Impossible de télécharger le rapport",
          )
          return this.handleError(error)
        }),
      )
  }

  validateRapport(rapportId: number, commentaire?: string): Observable<Rapport> {
    const loadingId = this.notificationService.loading("Validation du rapport...", "Enregistrement de votre décision")

    const body = commentaire ? { commentaire } : {}

    return this.http.put<Rapport>(`${this.baseUrl}/rapports/${rapportId}/validate`, body).pipe(
      tap(() => {
        this.notificationService.operationSuccess(
          loadingId,
          "Rapport validé",
          commentaire ? "Rapport validé avec commentaire" : "Rapport validé sans commentaire",
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Validation", "Impossible de valider le rapport")
        return this.handleError(error)
      }),
    )
  }

  rejectRapport(rapportId: number, commentaire: string): Observable<Rapport> {
    const loadingId = this.notificationService.loading("Rejet du rapport...", "Enregistrement de votre décision")

    return this.http.put<Rapport>(`${this.baseUrl}/rapports/${rapportId}/reject`, { commentaire }).pipe(
      tap(() => {
        this.notificationService.operationSuccess(loadingId, "Rapport rejeté", "Rapport rejeté avec commentaire")
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Rejet", "Impossible de rejeter le rapport")
        return this.handleError(error)
      }),
    )
  }

  // ==================== DECISION MANAGEMENT ====================

  getMesDemandes(): Observable<Stage[]> {
    const loadingId = this.notificationService.loading(
      "Chargement de vos demandes...",
      "Récupération des demandes en attente",
    )

    return this.http.get<Stage[]>(`${this.baseUrl}/encadrants/me/demandes`).pipe(
      tap((demandes) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Demandes",
          `${demandes.length} demande(s) en attente de votre validation`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Demandes", "Impossible de charger vos demandes")
        return this.handleError(error)
      }),
    )
  }

  approveDecision(dto: DecisionDto): Observable<{ message: string }> {
    const loadingId = this.notificationService.loading("Approbation en cours...", "Validation de la demande")

    return this.http.post<{ message: string }>(`${this.baseUrl}/encadrants/decision`, dto).pipe(
      tap((response) => {
        this.notificationService.operationSuccess(loadingId, "Demande approuvée", response.message)
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Approbation", "Impossible d'approuver la demande")
        return this.handleError(error)
      }),
    )
  }

  rejectStage(stageId: number, raison: string): Observable<string> {
    const dto: DecisionDto = { idStage: stageId, approuver: false }
    const loadingId = this.notificationService.loading("Rejet en cours...", "Enregistrement du refus")

    return this.http.post<{ message: string }>(`${this.baseUrl}/encadrants/decision`, dto).pipe(
      map((response) => response.message),
      tap((message) => {
        this.notificationService.operationSuccess(loadingId, "Demande rejetée", message)
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Rejet", "Impossible de rejeter la demande")
        return this.handleError(error)
      }),
    )
  }

  // ==================== ASSIGNMENT MANAGEMENT ====================

  getAssignments(): Observable<any[]> {
    const loadingId = this.notificationService.loading("Chargement des affectations...", "Récupération des associations")

    return this.http.get<any[]>(`${this.baseUrl}/admin/assignments`).pipe(
      tap((assignments) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Affectations",
          `${assignments.length} affectation(s) trouvée(s)`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Affectations", "Impossible de charger les affectations")
        return this.handleError(error)
      }),
    )
  }

  assignerEncadrantGroupe(request: GroupAssignmentRequest): Observable<{ message: string }> {
    const loadingId = this.notificationService.loading(
      "Affectation par groupe...",
      "Attribution de l'encadrant au groupe sélectionné",
    )

    console.log("🎯 Group assignment request:", request)

    return this.http.post<{ message: string }>(`${this.baseUrl}/admin/assigner-encadrant-groupe`, request).pipe(
      tap((response) => {
        console.log("✅ Group assignment successful:", response)
        this.notificationService.operationSuccess(loadingId, "Affectation réussie", response.message)
      }),
      catchError((error) => {
        console.error("❌ Group assignment failed:", error)
        this.notificationService.operationError(loadingId, "Affectation", "Impossible d'affecter l'encadrant au groupe")
        return this.handleError(error)
      }),
    )
  }

  removeAssignment(assignmentId: number): Observable<void> {
    const loadingId = this.notificationService.loading("Suppression de l'affectation...", "Retrait de l'association")

    return this.http.delete<void>(`${this.baseUrl}/admin/assignments/${assignmentId}`).pipe(
      tap(() => {
        this.notificationService.operationSuccess(loadingId, "Affectation supprimée", "Association retirée avec succès")
      }),
      catchError((error) => {
        this.notificationService.operationError(
          loadingId,
          "Suppression",
          "Impossible de supprimer l'affectation",
        )
        return this.handleError(error)
      }),
    )
  }

  // ==================== REFERENCE DATA ====================

  listDepartements(): Observable<Array<{ id: number; nom: string }>> {
    return this.http.get<Array<{ id: number; nom: string }>>(`${this.baseUrl}/admin/departements`).pipe(
      catchError((error) => {
        console.error("Error loading departements:", error)
        return this.handleError(error)
      }),
    )
  }

  listClassGroups(departementId: number): Observable<Array<{ id: number; nom: string }>> {
    return this.http
      .get<Array<{ id: number; nom: string }>>(`${this.baseUrl}/admin/departements/${departementId}/class-groups`)
      .pipe(
        catchError((error) => {
          console.error("Error loading class groups:", error)
          return this.handleError(error)
        }),
      )
  }

  listAllClassGroups(): Observable<Array<{ id: number; nom: string }>> {
    return this.http.get<Array<{ id: number; nom: string }>>(`${this.baseUrl}/admin/class-groups`).pipe(
      catchError((error) => {
        console.error("Error loading all class groups:", error)
        return this.handleError(error)
      }),
    )
  }

  listAnneesScolaires(): Observable<Array<{ id: number; libelle: string }>> {
    return this.http.get<Array<{ id: number; libelle: string }>>(`${this.baseUrl}/admin/annee-scolaires`).pipe(
      catchError((error) => {
        console.error("Error loading school years:", error)
        return this.handleError(error)
      }),
    )
  }

  // ==================== STATISTICS ====================

  getStageStats(): Observable<any> {
    const loadingId = this.notificationService.loading("Calcul des statistiques...", "Analyse des données")

    return this.http.get<any>(`${this.baseUrl}/admin/statistiques`).pipe(
      tap((stats) => {
        this.notificationService.operationSuccess(
          loadingId,
          "Statistiques",
          `${stats.total} stages analysés`,
        )
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Statistiques", "Impossible de calculer les statistiques")
        return this.handleError(error)
      }),
    )
  }

  // ==================== DOCUMENT MANAGEMENT ====================

  downloadConvention(stageId: number): Observable<Blob> {
    const loadingId = this.notificationService.loading("Téléchargement convention...", "Génération du document")

    return this.http.get(`${this.baseUrl}/stages/convention?idStage=${stageId}`, { responseType: "blob" }).pipe(
      tap(() => {
        this.notificationService.operationSuccess(loadingId, "Convention", "Document téléchargé avec succès")
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Convention", "Impossible de télécharger la convention")
        return this.handleError(error)
      }),
    )
  }

  downloadAssurance(stageId: number): Observable<Blob> {
    const loadingId = this.notificationService.loading("Téléchargement assurance...", "Génération du document")

    return this.http.get(`${this.baseUrl}/stages/assurance?idStage=${stageId}`, { responseType: "blob" }).pipe(
      tap(() => {
        this.notificationService.operationSuccess(loadingId, "Assurance", "Document téléchargé avec succès")
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Assurance", "Impossible de télécharger l'assurance")
        return this.handleError(error)
      }),
    )
  }

  // ==================== COMMENT MANAGEMENT ====================

  listCommentaires(etudiantFilter?: string): Observable<CommentaireRapport[]> {
    let params = new HttpParams()
    if (etudiantFilter) {
      params = params.set("etudiant", etudiantFilter)
    }

    return this.http.get<CommentaireRapport[]>(`${this.baseUrl}/encadrants/me/commentaires`, { params }).pipe(
      catchError((error) => {
        console.error("Error loading comments:", error)
        return this.handleError(error)
      }),
    )
  }

  addComment(rapportId: number, texte: string): Observable<CommentaireRapport> {
    const loadingId = this.notificationService.loading("Ajout du commentaire...", "Enregistrement de votre commentaire")

    return this.http.post<CommentaireRapport>(`${this.baseUrl}/encadrants/${rapportId}/commentaire`, { texte }).pipe(
      tap(() => {
        this.notificationService.operationSuccess(loadingId, "Commentaire ajouté", "Votre commentaire a été enregistré")
      }),
      catchError((error) => {
        this.notificationService.operationError(loadingId, "Commentaire", "Impossible d'ajouter le commentaire")
        return this.handleError(error)
      }),
    )
  }





  // Download all planifs for encadrant as Excel
downloadPlanificationsExcel(encadrantId: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/planification/encadrant/${encadrantId}/export`, {
    responseType: 'blob'
  });
}

// Download single planification details as Excel
downloadPlanificationExcel(planifId: number): Observable<Blob> {
  return this.http.get(`${this.baseUrl}/planification/${planifId}/export`, {
    responseType: 'blob'
  });
}

// List students by class group
listStudentsByClassGroup(classGroupId: number): Observable<Array<{ id:number, nom:string, prenom:string }>> {
  return this.http.get<Array<{ id:number, nom:string, prenom:string }>>(`${this.baseUrl}/admin/class-groups/${classGroupId}/etudiants`);
}

// Delete detail
deleteDetail(detailId: number): Observable<void> {
  return this.http.delete<void>(`${this.baseUrl}/planification/details/${detailId}`);
}


  // ==================== ERROR HANDLING ====================

  private handleError(error: any): Observable<never> {
    console.error("🚨 StageService error:", error)

    let errorMessage = "Une erreur est survenue"

    if (error.status === 401) {
      errorMessage = "Session expirée. Veuillez vous reconnecter."
    } else if (error.status === 403) {
      errorMessage = "Accès refusé."
    } else if (error.status === 404) {
      errorMessage = "Ressource non trouvée."
    } else if (error.status === 409) {
      errorMessage = "Conflit: données déjà existantes."
    } else if (error.status === 0) {
      errorMessage = "Impossible de se connecter au serveur."
    } else if (error.error?.message) {
      errorMessage = error.error.message
    }

    return throwError(() => new Error(errorMessage))
  }


  downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  window.URL.revokeObjectURL(url);
}




}