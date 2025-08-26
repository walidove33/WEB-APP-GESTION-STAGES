

// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule } from '@angular/router';
// import { AuthService } from '../../../services/auth.service';
// import { StageService } from '../../../services/stage.service';
// import { ToastService } from '../../../services/toast.service';
// import { NavbarComponent } from '../../shared/navbar/navbar.component';
// import { User } from '../../../models/user.model';
// import { Stage, Rapport } from '../../../models/stage.model';
// import { HttpParams } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';
// import { HttpErrorResponse } from '@angular/common/http';
// import { DecisionDto } from '../../../models/stage.model';


// @Component({
//   selector: 'app-encadrant-dashboard',
//   standalone: true,
//   imports: [CommonModule, RouterModule, NavbarComponent],
//   templateUrl: './encadrant-dashboard.component.html',
//   styleUrls: ['./encadrant-dashboard.component.scss']
// })
// export class EncadrantDashboardComponent implements OnInit {
//   currentUser: User | null = null;
//   stages: Stage[] = [];
//   rapports: Rapport[] = [];
//   demandes: Stage[] = [];
//   loading = false;
//   loadingRapports = false;
//   loadingDemandes = true;
//   currentDate = new Date();

//   stats = {
//     total: 0,
//     enAttente: 0,
//     valides: 0,
//     refuses: 0,
//     enCours: 0,
//     termines: 0,
//     totalRapports: 0
//   };

//   // demandes: Stage[] = [];      // <— nouveau
//   // loadingDemandes = true;     //

//   constructor(
//     private authService: AuthService,
//     private stageService: StageService,
//     private toastService: ToastService
//   ) {}

//     ngOnInit(): void {
//     this.currentUser = this.authService.getCurrentUser();
//     this.loadData();
//     setTimeout(() => {
//       this.animateElements();
//     }, 100);
//   }

//  loadData(): void {
//     this.loadStages();
//     this.loadDemandes();
//     this.loadRapports();
//   }

//      loadStages(): void {
//     this.loading = true;
//     this.stageService.getMyAssignedStages().subscribe({
//       next: (stages) => {
//         this.stages = stages;
//         this.calculateStats();
//         this.loading = false;
//       },
//       error: (error) => {
//         this.loading = false;
//         this.toastService.error('Erreur lors du chargement des stages');
//         console.error('Error loading stages:', error);
//       }
//     });
//   }

//   loadDemandes(): void {
//     this.loadingDemandes = true;
//     this.stageService.getMesDemandes().subscribe({
//       next: (list) => {
//         this.demandes = list;
//         this.loadingDemandes = false;
//       },
//       error: (err) => {
//         this.loadingDemandes = false;
//         console.error("Erreur chargement demandes :", err);
//         this.toastService.error("Impossible de charger vos demandes");
//       }
//     });
//   }

//   loadRapports(): void {
//     this.loadingRapports = true;
//     this.stageService.getRapportsForEncadrant().subscribe({
//       next: list => {
//         this.rapports = list;
//         this.calculateStats();
//         this.loadingRapports = false;
//       },
//       error: err => {
//         this.loadingRapports = false;
//         this.toastService.error('Impossible de charger les rapports');
//       }
//     });
//   }

//   calculateStats(): void {
//     this.stats = {
//       total: this.stages.length,
//       enAttente: this.stages.filter(s => 
//           s.etat === 'DEMANDE' || 
//           s.etat === 'EN_ATTENTE_VALIDATION' || 
//           s.etat === 'VALIDATION_EN_COURS').length,
//       valides: this.stages.filter(s => 
//           s.etat === 'ACCEPTE' || 
//           s.etat === 'RAPPORT_SOUMIS').length,
//       refuses: this.stages.filter(s => s.etat === 'REFUSE').length,
//       enCours: this.stages.filter(s => s.etat === 'EN_COURS').length,
//       termines: this.stages.filter(s => s.etat === 'TERMINE').length,
//       totalRapports: this.rapports.length
//     };
//   }


  

//   animateElements(): void {
//     const cards = document.querySelectorAll('.stat-card');
//     cards.forEach((card, index) => {
//       setTimeout(() => {
//         card.classList.add('animate-slideInFromBottom');
//       }, index * 150);
//     });
//   }

//   getTotalStages(): number {
//     return this.stages.length;
//   }

//   getTotalRapports(): number {
//     return this.rapports.length;
//   }

//   getStagesByStatus(statusKey: string): Stage[] {
//   let statuses: string[] = [];
  
//   switch(statusKey) {
//     case 'EN_ATTENTE':
//       statuses = ['DEMANDE', 'EN_ATTENTE_VALIDATION', 'VALIDATION_EN_COURS'];
//       break;
//     case 'VALIDE':
//       statuses = ['ACCEPTE', 'RAPPORT_SOUMIS'];  // Utiliser 'ACCEPTE'
//       break;
//     case 'REFUSE':
//       statuses = ['REFUSE'];
//       break;
//     default:
//       statuses = [statusKey];
//   }
  
//   return this.stages.filter(s => statuses.includes(s.etat));
// }

//   getRecentRapports(): Rapport[] {
//     return this.rapports.slice(0, 5);
//   }

//   getValidationPercentage(status: string): number {
//     const total = this.getTotalStages();
//     if (total === 0) return 0;
//     return (this.getStagesByStatus(status).length / total) * 100;
//   }

//   getProgressPercentage(status: string): number {
//     if (this.stats.total === 0) return 0;
//     const count = this.stats[status as keyof typeof this.stats] as number;
//     return (count / this.stats.total) * 100;
//   }

//   // Mettre à jour les fonctions getStatusText et getStatusBadgeClass
// // Mettre à jour les fonctions getStatusText et getStatusBadgeClass
// getStatusText(status: string): string {
//   const statusMap: { [key: string]: string } = {
//     'DEMANDE': 'Demande créée',
//     'EN_ATTENTE_VALIDATION': 'En attente de validation',
//     'VALIDATION_EN_COURS': 'Validation en cours',
//     'ACCEPTE': 'Validé', // Changer de 'VALIDE' à 'ACCEPTE'
//     'REFUSE': 'Refusé',
//     'EN_COURS': 'En cours',
//     'TERMINE': 'Terminé',
//     'RAPPORT_SOUMIS': 'Rapport soumis'
//   };
//   return statusMap[status] || status;
// }

// getStatusBadgeClass(status: string): string {
//   const classMap: { [key: string]: string } = {
//     'DEMANDE': 'badge-neutral',
//     'EN_ATTENTE_VALIDATION': 'badge-warning',
//     'VALIDATION_EN_COURS': 'badge-accent',
//     'ACCEPTE': 'badge-success', // Changer de 'VALIDE' à 'ACCEPTE'
//     'REFUSE': 'badge-error',
//     'EN_COURS': 'badge-primary',
//     'TERMINE': 'badge-secondary',
//     'RAPPORT_SOUMIS': 'badge-info'
//   };
//   return classMap[status] || 'badge-secondary';
// }


// approveDemande(stageId: number): void {
//   const dto: DecisionDto = { idStage: stageId, approuver: true };

//   this.stageService.approveDecision(dto).subscribe({
//     next: (res) => {
//       // res est de type { message: string }
//       this.toastService.success(res.message);
//       this.loadDemandes();
//     },
//     error: (err) => {
//       this.toastService.error("Erreur lors de l'approbation");
//       console.error("Error decision:", err);
//     }
//   });
// }


// rejectDemande(stageId: number): void {
//   const raison = "Refus standard";
  
//   this.stageService.rejectStage(stageId, raison).subscribe({
//     next: (msg) => {
//       this.toastService.success(msg); // Utilisez directement la réponse texte
//       this.loadDemandes();
//     },
//     error: (err) => {
//       this.toastService.error("Erreur lors du rejet du stage");
//       console.error("Error rejecting stage:", err);
//     }
//   });
// }

// downloadReport(stageId: number): void {
//   this.stageService.downloadRapport(stageId).subscribe({
//     next: (response) => {
//       // Extraire le nom de fichier
//       const contentDisposition = response.headers.get('Content-Disposition') || '';
//       let fileName = 'rapport_stage.pdf';
      
//       const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
//       if (fileNameMatch && fileNameMatch[1]) {
//         fileName = fileNameMatch[1];
        
//         // Forcer l'extension .pdf
//         if (!fileName.toLowerCase().endsWith('.pdf')) {
//           fileName += '.pdf';
//         }
//       }
      
//       // Créer le blob
//       const blob = new Blob([response.body!], { type: 'application/pdf' });
//       const url = window.URL.createObjectURL(blob);
      
//       // Créer le lien
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = fileName;
//       document.body.appendChild(a);
//       a.click();
      
//       // Nettoyer
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
//     },
//     error: (err) => {
//       this.toastService.error('Erreur de téléchargement du rapport');
//       console.error(err);
//     }
//   });
// }


//   validateReport(rapportId: number): void {
//     const commentaire = prompt('Commentaire optionnel:');
//     this.stageService.validateRapport(rapportId, commentaire || undefined).subscribe({
//       next: (rapport) => {
//         this.toastService.success('Rapport validé avec succès');
//         this.loadRapports();
//       },
//       error: (error) => {
//         this.toastService.error('Erreur lors de la validation du rapport');
//         console.error('Error validating report:', error);
//       }
//     });
//   }

//   rejectReport(rapportId: number): void {
//     const commentaire = prompt('Raison du rejet (obligatoire):');
//     if (!commentaire) {
//       this.toastService.error('Veuillez fournir une raison pour le rejet');
//       return;
//     }

//     this.stageService.rejectRapport(rapportId, commentaire).subscribe({
//       next: (rapport) => {
//         this.toastService.success('Rapport rejeté avec succès');
//         this.loadRapports();
//       },
//       error: (error) => {
//         this.toastService.error('Erreur lors du rejet du rapport');
//         console.error('Error rejecting report:', error);
//       }
//     });
//   }

//   private downloadFile(blob: Blob, filename: string): void {
//     const url = window.URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = filename;
//     document.body.appendChild(a);
//     a.click();
//     document.body.removeChild(a);
//     window.URL.revokeObjectURL(url);
//   }
// }


import { Component, type OnInit, type OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

import  { AuthService } from "../../../services/auth.service"
import  { StageService } from "../../../services/stage.service"
import  { NotificationService } from "../../../services/notification.service"
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from "../../../shared/components/card/card.component"
import { LoadingComponent } from "../../../shared/components/loading/loading.component"
import {
  EmptyStateComponent,
  type EmptyStateAction,
} from "../../../shared/components/empty-state/empty-state.component"

import type { User } from "../../../models/user.model"
import type { Stage, RapportDetails, DecisionDto } from "../../../models/stage.model"

@Component({
  selector: "app-encadrant-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, CardComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: "./encadrant-dashboard.component.html",
  styleUrls: ["./encadrant-dashboard.component.scss"],
})
export class EncadrantDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  currentUser: User | null = null
  stages: Stage[] = []
  // rapports: Rapport[] = []
  rapports: RapportDetails[] = [];
  demandes: Stage[] = []
  loading = false
  loadingRapports = false
  loadingDemandes = true
  currentDate = new Date()

  stats = {
    total: 0,
    enAttente: 0,
    valides: 0,
    refuses: 0,
    enCours: 0,
    termines: 0,
    totalRapports: 0,
  }

  emptyDemandesActions: EmptyStateAction[] = [
    {
      label: "Actualiser",
      icon: "bi-arrow-clockwise",
      variant: "primary",
      action: () => this.loadDemandes(),
    },
  ]

  emptyRapportsActions: EmptyStateAction[] = [
    {
      label: "Voir tous les rapports",
      icon: "bi-eye",
      variant: "primary",
      action: () => {
        // Navigation will be handled by router
      },
    },
  ]

  constructor(
    private authService: AuthService,
    private stageService: StageService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.loadData()
    setTimeout(() => {
      this.animateElements()
    }, 100)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadData(): void {
    this.loadStages()
    this.loadDemandes()
    this.loadRapports()
  }

  loadStages(): void {
    this.loading = true
    this.stageService
      .getMyAssignedStages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages
          this.calculateStats()
          this.loading = false
        },
        error: (error) => {
          this.loading = false
          this.notificationService.error("Erreur de chargement", "Erreur lors du chargement des stages")
          // console.error("Error loading stages:", error)
        },
      })
  }

  loadDemandes(): void {
    this.loadingDemandes = true
    this.stageService
      .getMesDemandes()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
          this.demandes = list
          this.loadingDemandes = false
        },
        error: (err) => {
          this.loadingDemandes = false
          // console.error("Erreur chargement demandes :", err)
          this.notificationService.error("Erreur de chargement", "Impossible de charger vos demandes")
        },
      })
  }

  loadRapports(): void {
    this.loadingRapports = true
    this.stageService
      .getRapportsForEncadrant()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (list) => {
          this.rapports = list
          this.calculateStats()
          this.loadingRapports = false
        },
        error: (err) => {
          this.loadingRapports = false
          this.notificationService.error("Erreur de chargement", "Impossible de charger les rapports")
        },
      })
  }

  calculateStats(): void {
    this.stats = {
      total: this.stages.length,
      enAttente: this.stages.filter(
        (s) => s.etat === "DEMANDE" || s.etat === "EN_ATTENTE_VALIDATION" || s.etat === "VALIDATION_EN_COURS",
      ).length,
      valides: this.stages.filter((s) => s.etat === "ACCEPTE" || s.etat === "RAPPORT_SOUMIS").length,
      refuses: this.stages.filter((s) => s.etat === "REFUSE").length,
      enCours: this.stages.filter((s) => s.etat === "EN_COURS").length,
      termines: this.stages.filter((s) => s.etat === "TERMINE").length,
      totalRapports: this.rapports.length,
    }
  }

  animateElements(): void {
    const cards = document.querySelectorAll(".stat-card")
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add("animate-slideInFromBottom")
      }, index * 150)
    })
  }

  getTotalStages(): number {
    return this.stages.length
  }

  getTotalRapports(): number {
    return this.rapports.length
  }

  getStagesByStatus(statusKey: string): Stage[] {
    let statuses: string[] = []

    switch (statusKey) {
      case "EN_ATTENTE":
        statuses = ["DEMANDE", "EN_ATTENTE_VALIDATION", "VALIDATION_EN_COURS"]
        break
      case "VALIDE":
        statuses = ["ACCEPTE", "RAPPORT_SOUMIS"]
        break
      case "REFUSE":
        statuses = ["REFUSE"]
        break
      default:
        statuses = [statusKey]
    }

    return this.stages.filter((s) => statuses.includes(s.etat))
  }

  // getRecentRapports(): Rapport[] {
  //   return this.rapports.slice(0, 5)
  // }

  getRecentRapports(): RapportDetails[] {
  return this.rapports.slice(0, 5);
}

  getValidationPercentage(status: string): number {
    const total = this.getTotalStages()
    if (total === 0) return 0
    return (this.getStagesByStatus(status).length / total) * 100
  }

  getProgressPercentage(status: string): number {
    if (this.stats.total === 0) return 0
    const count = this.stats[status as keyof typeof this.stats] as number
    return (count / this.stats.total) * 100
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      DEMANDE: "Demande créée",
      EN_ATTENTE_VALIDATION: "En attente de validation",
      VALIDATION_EN_COURS: "Validation en cours",
      ACCEPTE: "Validé",
      REFUSE: "Refusé",
      EN_COURS: "En cours",
      TERMINE: "Terminé",
      RAPPORT_SOUMIS: "Rapport soumis",
    }
    return statusMap[status] || status
  }

  getStatusBadgeClass(status: string): string {
    const classMap: { [key: string]: string } = {
      DEMANDE: "badge-neutral",
      EN_ATTENTE_VALIDATION: "badge-warning",
      VALIDATION_EN_COURS: "badge-accent",
      ACCEPTE: "badge-success",
      REFUSE: "badge-error",
      EN_COURS: "badge-primary",
      TERMINE: "badge-secondary",
      RAPPORT_SOUMIS: "badge-info",
    }
    return classMap[status] || "badge-secondary"
  }

  approveDemande(stageId: number): void {
    const dto: DecisionDto = { idStage: stageId, approuver: true }
    this.stageService
      .approveDecision(dto)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          this.notificationService.success("Demande approuvée", res.message)
          this.loadDemandes()
        },
        error: (err) => {
          this.notificationService.error("Erreur d'approbation", "Erreur lors de l'approbation")
          // console.error("Error decision:", err)
        },
      })
  }

  rejectDemande(stageId: number): void {
    this.notificationService.warning("Confirmer le rejet", "Êtes-vous sûr de vouloir rejeter cette demande ?", 0, [
      {
        label: "Annuler",
        style: "secondary",
        action: () => {},
      },
      {
        label: "Rejeter",
        style: "danger",
        action: () => {
          const raison = "Refus standard"
          this.stageService
            .rejectStage(stageId, raison)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: (msg) => {
                this.notificationService.success("Demande rejetée", msg)
                this.loadDemandes()
              },
              error: (err) => {
                this.notificationService.error("Erreur de rejet", "Erreur lors du rejet du stage")
                // console.error("Error rejecting stage:", err)
              },
            })
        },
      },
    ])
  }

  downloadReport(stageId: number): void {
    this.stageService
      .downloadRapport(stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          const contentDisposition = response.headers.get("Content-Disposition") || ""
          let fileName = "rapport_stage.pdf"

          const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/)
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1]
            if (!fileName.toLowerCase().endsWith(".pdf")) {
              fileName += ".pdf"
            }
          }

          const blob = new Blob([response.body!], { type: "application/pdf" })
          const url = window.URL.createObjectURL(blob)

          const a = document.createElement("a")
          a.href = url
          a.download = fileName
          document.body.appendChild(a)
          a.click()

          window.URL.revokeObjectURL(url)
          document.body.removeChild(a)

          this.notificationService.success("Téléchargement réussi", "Le rapport a été téléchargé avec succès")
        },
        error: (err) => {
          this.notificationService.error("Erreur de téléchargement", "Erreur de téléchargement du rapport")
          // console.error(err)
        },
      })
  }

  validateReport(rapportId: number): void {
    this.notificationService.info("Validation du rapport", "Voulez-vous ajouter un commentaire ?", 0, [
      {
        label: "Sans commentaire",
        style: "secondary",
        action: () => {
          this.performValidateReport(rapportId, undefined)
        },
      },
      {
        label: "Avec commentaire",
        style: "primary",
        action: () => {
          const commentaire = prompt("Commentaire optionnel:")
          this.performValidateReport(rapportId, commentaire || undefined)
        },
      },
    ])
  }

  private performValidateReport(rapportId: number, commentaire?: string): void {
    this.stageService
      .validateRapport(rapportId, commentaire)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rapport) => {
          this.notificationService.success("Rapport validé", "Le rapport a été validé avec succès")
          this.loadRapports()
        },
        error: (error) => {
          this.notificationService.error("Erreur de validation", "Erreur lors de la validation du rapport")
          // console.error("Error validating report:", error)
        },
      })
  }

  rejectReport(rapportId: number): void {
    const commentaire = prompt("Raison du rejet (obligatoire):")
    if (!commentaire) {
      this.notificationService.error("Commentaire requis", "Veuillez fournir une raison pour le rejet")
      return
    }

    this.stageService
      .rejectRapport(rapportId, commentaire)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (rapport) => {
          this.notificationService.success("Rapport rejeté", "Le rapport a été rejeté avec succès")
          this.loadRapports()
        },
        error: (error) => {
          this.notificationService.error("Erreur de rejet", "Erreur lors du rejet du rapport")
          // console.error("Error rejecting report:", error)
        },
      })
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
}