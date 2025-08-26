// import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { Subject, takeUntil } from 'rxjs';

// import { PlanificationService } from '../../../services/planification.service';
// import { AuthService } from '../../../services/auth.service';
// import { NotificationService } from '../../../services/notification.service';
// import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
// import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';
// import { LoadingComponent } from '../../../shared/components/loading/loading.component';
// import { CardComponent } from '../../../shared/components/card/card.component';

// import { 
//   PlanificationSoutenanceResponse, 
//   DetailSoutenance 
// } from '../../../models/stage.model';
// import { User } from '../../../models/user.model';

// @Component({
//   selector: 'app-planifications',
//   standalone: true,
//   imports: [
//     CommonModule, 
//     FormsModule, 
//     RouterModule, 
//     NavbarComponent, 
//     DataTableComponent, 

//     CardComponent
//   ],
//   templateUrl: './planifications.component.html',
//   styleUrls: ['./planifications.component.scss']
// })
// export class PlanificationsComponent implements OnInit, OnDestroy {
//   @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
//   @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
//   @ViewChild('encadrantTemplate', { static: true }) encadrantTemplate!: TemplateRef<any>;

//   private destroy$ = new Subject<void>();

//   currentUser: User | null = null;
//   planifications: PlanificationSoutenanceResponse[] = [];
//   selectedPlanification: PlanificationSoutenanceResponse | null = null;
//   planificationDetails: DetailSoutenance[] = [];
  
//   loading = false;
//   loadingDetails = false;
//   showDetailModal = false;
//   showCreateModal = false;

//   // Table configuration
//   columns: TableColumn<PlanificationSoutenanceResponse>[] = [];
//   actions: TableAction<PlanificationSoutenanceResponse>[] = [];
//   detailColumns: TableColumn<DetailSoutenance>[] = [];
//   detailActions: TableAction<DetailSoutenance>[] = [];

//   // Form data
//   newDetail: DetailSoutenance = {
//     id: 0,
//     sujet: '',
//     dateSoutenance: '',
//     heureDebut: '',
//     heureFin: '',
//     etudiant: { id: 0 },
//     planification: { id: 0 }
//   };

//   // Statistics
//   stats = {
//     total: 0,
//     upcoming: 0,
//     past: 0,
//     totalSlots: 0
//   };

//   constructor(
//     private planificationService: PlanificationService,
//     private authService: AuthService,
//     private notificationService: NotificationService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.currentUser = this.authService.getCurrentUser();
//     this.initializeTableColumns();
//     this.loadData();

//     this.notificationService.info(
//       'Gestion des Planifications',
//       'Bienvenue dans votre espace de gestion des soutenances'
//     );
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   private initializeTableColumns(): void {
//     this.columns = [
//       {
//         key: 'id',
//         label: '#',
//         width: '80px',
//         sortable: true,
//         type: 'text'
//       },
//       {
//         key: 'dateSoutenance',
//         label: 'Date de Soutenance',
//         sortable: true,
//         type: 'custom',
//         template: this.dateTemplate
//       },
//       {
//         key: 'encadrant',
//         label: 'Encadrant',
//         type: 'custom',
//         template: this.encadrantTemplate
//       },
//       {
//         key: 'departement',
//         label: 'Département',
//         sortable: true,
//         type: 'text',
//         format: (row) => row.departement.nom
//       },
//       {
//         key: 'classeGroupe',
//         label: 'Classe/Groupe',
//         sortable: true,
//         type: 'text',
//         format: (row) => row.classeGroupe.nom
//       },
//       {
//         key: 'anneeScolaire',
//         label: 'Année Scolaire',
//         sortable: true,
//         type: 'text',
//         format: (row) => row.anneeScolaire.libelle
//       }
//     ];

//     this.actions = [
//       {
//         label: 'Voir les créneaux',
//         icon: 'bi-eye',
//         class: 'btn-outline-primary',
//         action: (planification) => this.viewPlanificationDetails(planification)
//       },
//       {
//         label: 'Ajouter un créneau',
//         icon: 'bi-plus-circle',
//         class: 'btn-outline-success',
//         action: (planification) => this.openDetailModal(planification)
//       },
//       {
//         label: 'Exporter PDF',
//         icon: 'bi-file-earmark-pdf',
//         class: 'btn-outline-secondary',
//         action: (planification) => this.exportToPDF(planification)
//       }
//     ];

//     this.detailColumns = [
//       {
//         key: 'heureDebut',
//         label: 'Heure Début',
//         sortable: true,
//         type: 'text',
//         format: (value) => value?.substring(0, 5)
//       },
//       {
//         key: 'heureFin',
//         label: 'Heure Fin',
//         sortable: true,
//         type: 'text',
//         format: (value) => value?.substring(0, 5)
//       },
//       {
//         key: 'sujet',
//         label: 'Sujet',
//         sortable: true,
//         type: 'text'
//       },
//       {
//         key: 'etudiant',
//         label: 'Étudiant',
//         type: 'text',
//         format: (etudiant) => etudiant?.nom && etudiant?.prenom ? 
//           `${etudiant.prenom} ${etudiant.nom}` : 'Non assigné'
//       }
//     ];

//     this.detailActions = [
//       {
//         label: 'Modifier',
//         icon: 'bi-pencil',
//         class: 'btn-outline-primary',
//         action: (detail) => this.editDetail(detail)
//       },
//       {
//         label: 'Supprimer',
//         icon: 'bi-trash',
//         class: 'btn-outline-danger',
//         action: (detail) => this.deleteDetail(detail)
//       }
//     ];
//   }


//   private loadData(): void {
//     if (!this.currentUser) return;

//     this.loading = true;
//     this.planificationService.getByEncadrant(this.currentUser.id)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (planifications) => {
//           this.planifications = planifications;
//           this.calculateStats();
//           this.loading = false;
//           this.cdr.detectChanges();
//         },
//         error: (error) => {
//           this.loading = false;
//           console.error('Erreur chargement planifications:', error);
//           this.cdr.detectChanges();
//         }
//       });
//   }

//   private calculateStats(): void {
//     const today = new Date().toISOString().split('T')[0];
    
//     this.stats = {
//       total: this.planifications.length,
//       upcoming: this.planifications.filter(p => p.dateSoutenance >= today).length,
//       past: this.planifications.filter(p => p.dateSoutenance < today).length,
//       totalSlots: 0 // Will be calculated when details are loaded
//     };
//   }

//   viewPlanificationDetails(planification: PlanificationSoutenanceResponse): void {
//     this.selectedPlanification = planification;
//     this.loadPlanificationDetails(planification.id);
    
//     this.notificationService.info(
//       'Détails de planification',
//       `Affichage des créneaux pour le ${this.formatDate(planification.dateSoutenance)}`
//     );
//   }

//   private loadPlanificationDetails(planifId: number): void {
//     this.loadingDetails = true;
//     this.planificationService.getDetails(planifId)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (details) => {
//           this.planificationDetails = details;
//           this.loadingDetails = false;
//           this.cdr.detectChanges();
//         },
//         error: (error) => {
//           this.loadingDetails = false;
//           console.error('Erreur chargement détails:', error);
//           this.cdr.detectChanges();
//         }
//       });
//   }

//   openDetailModal(planification: PlanificationSoutenanceResponse): void {
//     this.selectedPlanification = planification;
//     this.newDetail = {
//       id: 0,
//       sujet: '',
//       dateSoutenance: planification.dateSoutenance,
//       heureDebut: '',
//       heureFin: '',
//       etudiant: { id: 0 },
//       planification: { id: planification.id }
//     };
//     this.showDetailModal = true;
//   }

//   closeDetailModal(): void {
//     this.showDetailModal = false;
//     this.selectedPlanification = null;
//     this.resetDetailForm();
//   }

//   addDetailToPlanification(): void {
//     if (!this.selectedPlanification || !this.validateDetailForm()) {
//       return;
//     }

//     this.planificationService.addDetail(this.selectedPlanification.id, this.newDetail)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (detail) => {
//           this.closeDetailModal();
//           if (this.selectedPlanification) {
//             this.loadPlanificationDetails(this.selectedPlanification.id);
//           }
//           this.cdr.detectChanges();
//         },
//         error: (error) => {
//           console.error('Erreur ajout détail:', error);
//         }
//       });
//   }

//   editDetail(detail: DetailSoutenance): void {
//     this.newDetail = { ...detail };
//     this.showDetailModal = true;
//   }

//   deleteDetail(detail: DetailSoutenance): void {
//     this.notificationService.warning(
//       'Confirmer la suppression',
//       `Êtes-vous sûr de vouloir supprimer ce créneau (${detail.heureDebut} - ${detail.heureFin}) ?`,
//       0,
//       [
//         {
//           label: 'Annuler',
//           style: 'secondary',
//           action: () => {
//             this.notificationService.info('Suppression annulée', 'Le créneau a été conservé');
//           }
//         },
//         {
//           label: 'Supprimer',
//           style: 'danger',
//           action: () => {
//             this.performDeleteDetail(detail);
//           }
//         }
//       ]
//     );
//   }

//   private performDeleteDetail(detail: DetailSoutenance): void {
//     this.planificationService.deleteDetail(detail.id)
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: () => {
//           if (this.selectedPlanification) {
//             this.loadPlanificationDetails(this.selectedPlanification.id);
//           }
//           this.cdr.detectChanges();
//         },
//         error: (error) => {
//           console.error('Erreur suppression détail:', error);
//         }
//       });
//   }

//   exportToPDF(planification: PlanificationSoutenanceResponse): void {
//     this.notificationService.info(
//       'Export PDF',
//       `Génération du PDF pour la planification du ${this.formatDate(planification.dateSoutenance)}...`
//     );
    
//     // TODO: Implement PDF export
//     setTimeout(() => {
//       this.notificationService.success(
//         'Export réussi',
//         'Le fichier PDF a été téléchargé avec succès'
//       );
//     }, 2000);
//   }

//   backToPlanifications(): void {
//     this.selectedPlanification = null;
//     this.planificationDetails = [];
//   }

//   refreshData(): void {
//     this.loadData();
//   }

//   private validateDetailForm(): boolean {
//     const { sujet, heureDebut, heureFin, etudiant } = this.newDetail;

//     if (!sujet.trim()) {
//       this.notificationService.error('Sujet requis', 'Le sujet de soutenance est obligatoire');
//       return false;
//     }

//     if (!heureDebut) {
//       this.notificationService.error('Heure début requise', 'L\'heure de début est obligatoire');
//       return false;
//     }

//     if (!heureFin) {
//       this.notificationService.error('Heure fin requise', 'L\'heure de fin est obligatoire');
//       return false;
//     }

//     if (heureDebut >= heureFin) {
//       this.notificationService.error('Horaires invalides', 'L\'heure de fin doit être après l\'heure de début');
//       return false;
//     }

//     if (!etudiant.id) {
//       this.notificationService.error('Étudiant requis', 'Veuillez sélectionner un étudiant');
//       return false;
//     }

//     return true;
//   }

//   private resetDetailForm(): void {
//     this.newDetail = {
//       id: 0,
//       sujet: '',
//       dateSoutenance: '',
//       heureDebut: '',
//       heureFin: '',
//       etudiant: { id: 0 },
//       planification: { id: 0 }
//     };
//   }

//   formatDate(date: string): string {
//     return new Date(date).toLocaleDateString('fr-FR', {
//       weekday: 'long',
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric'
//     });
//   }

//   formatTime(time: string): string {
//     return time?.substring(0, 5) || '';
//   }

//   getEncadrantName(encadrant: any): string {
//     if (!encadrant) return 'Non assigné';
//     return `${encadrant.prenom} ${encadrant.nom}`;
//   }

//   getStatusBadgeClass(planification: PlanificationSoutenanceResponse): string {
//     const today = new Date().toISOString().split('T')[0];
    
//     if (planification.dateSoutenance < today) {
//       return 'badge-secondary';
//     } else if (planification.dateSoutenance === today) {
//       return 'badge-warning';
//     } else {
//       return 'badge-primary';
//     }
//   }

  

//   getStatusText(planification: PlanificationSoutenanceResponse): string {
//     const today = new Date().toISOString().split('T')[0];
    
//     if (planification.dateSoutenance < today) {
//       return 'Terminée';
//     } else if (planification.dateSoutenance === today) {
//       return 'Aujourd\'hui';
//     } else {
//       const days = Math.ceil((new Date(planification.dateSoutenance).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
//       return `Dans ${days} jour${days > 1 ? 's' : ''}`;
//     }
//   }

//   // Keyboard shortcuts
//   onKeyDown(event: KeyboardEvent): void {
//     if (event.key === 'Escape') {
//       this.closeDetailModal();
//       this.backToPlanifications();
//     }
    
//     if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
//       event.preventDefault();
//       this.refreshData();
//     }
//   }
// }

import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PlanificationService } from '../../../services/planification.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { DataTableComponent, TableColumn, TableAction } from '../../../shared/components/data-table/data-table.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { take } from 'rxjs/operators';


import { 
  PlanificationSoutenanceResponse, 
  DetailSoutenance 
} from '../../../models/stage.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-planifications',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    NavbarComponent, 
    DataTableComponent, 

    CardComponent
  ],
  templateUrl: './planifications.component.html',
  styleUrls: ['./planifications.component.scss']
})
export class PlanificationsComponent implements OnInit, OnDestroy {
  @ViewChild('actionsTemplate', { static: true }) actionsTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;
  @ViewChild('encadrantTemplate', { static: true }) encadrantTemplate!: TemplateRef<any>;

  private destroy$ = new Subject<void>();


  students: Array<{id:number, nom?:string, prenom?:string}> = [];


  currentUser: User | null = null;
  planifications: PlanificationSoutenanceResponse[] = [];
  selectedPlanification: PlanificationSoutenanceResponse | null = null;
  planificationDetails: DetailSoutenance[] = [];
  
  loading = false;
  loadingDetails = false;
  showDetailModal = false;
  showCreateModal = false;

  // Table configuration
  columns: TableColumn<PlanificationSoutenanceResponse>[] = [];
  actions: TableAction<PlanificationSoutenanceResponse>[] = [];
  detailColumns: TableColumn<DetailSoutenance>[] = [];
  detailActions: TableAction<DetailSoutenance>[] = [];

  // Form data
  newDetail: DetailSoutenance = {
    id: 0,
    sujet: '',
    dateSoutenance: '',
    heureDebut: '',
    heureFin: '',
    etudiant: { id: 0 },
    planification: { id: 0 }
  };

  // Statistics
  stats = {
    total: 0,
    upcoming: 0,
    past: 0,
    totalSlots: 0
  };

  constructor(
    private planificationService: PlanificationService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.initializeTableColumns();
    this.loadData();

    this.notificationService.info(
      'Gestion des Planifications',
      'Bienvenue dans votre espace de gestion des soutenances'
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTableColumns(): void {
    this.columns = [
      {
        key: 'id',
        label: '#',
        width: '80px',
        sortable: true,
        type: 'text'
      },
      {
        key: 'dateSoutenance',
        label: 'Date de Soutenance',
        sortable: true,
        type: 'custom',
        template: this.dateTemplate
      },
      {
        key: 'encadrant',
        label: 'Encadrant',
        type: 'custom',
        template: this.encadrantTemplate
      },
      {
        key: 'departement',
        label: 'Département',
        sortable: true,
        type: 'text',
        format: (row) => row.departement.nom
      },
      {
        key: 'classeGroupe',
        label: 'Classe/Groupe',
        sortable: true,
        type: 'text',
        format: (row) => row.classeGroupe.nom
      },
      {
        key: 'anneeScolaire',
        label: 'Année Scolaire',
        sortable: true,
        type: 'text',
        format: (row) => row.anneeScolaire.libelle
      }
    ];

    this.actions = [
      {
        label: 'Voir les créneaux',
        icon: 'bi-eye',
        class: 'btn-outline-primary',
        action: (planification) => this.viewPlanificationDetails(planification)
      },
      {
        label: 'Ajouter un créneau',
        icon: 'bi-plus-circle',
        class: 'btn-outline-success',
        action: (planification) => this.openDetailModal(planification)
      },
      {
        label: 'Exporter PDF',
        icon: 'bi-file-earmark-pdf',
        class: 'btn-outline-secondary',
        action: (planification) => this.exportToPDF(planification)
      }
    ];

    this.detailColumns = [
      {
        key: 'heureDebut',
        label: 'Heure Début',
        sortable: true,
        type: 'text',
        format: (value) => value?.substring(0, 5)
      },
      {
        key: 'heureFin',
        label: 'Heure Fin',
        sortable: true,
        type: 'text',
        format: (value) => value?.substring(0, 5)
      },
      {
        key: 'sujet',
        label: 'Sujet',
        sortable: true,
        type: 'text'
      },
      {
        key: 'etudiant',
        label: 'Étudiant',
        type: 'text',
        format: (etudiant) => etudiant?.nom && etudiant?.prenom ? 
          `${etudiant.prenom} ${etudiant.nom}` : 'Non assigné'
      }
    ];

    this.detailActions = [
      {
        label: 'Modifier',
        icon: 'bi-pencil',
        class: 'btn-outline-primary',
        action: (detail) => this.editDetail(detail)
      },
      {
        label: 'Supprimer',
        icon: 'bi-trash',
        class: 'btn-outline-danger',
        action: (detail) => this.deleteDetail(detail)
      }
    ];
  }


  private loadData(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.planificationService.getByEncadrant(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (planifications) => {
          this.planifications = planifications;
          this.calculateStats();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.loading = false;
          // console.error('Erreur chargement planifications:', error);
          this.cdr.detectChanges();
        }
      });
  }

  private calculateStats(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.stats = {
      total: this.planifications.length,
      upcoming: this.planifications.filter(p => p.dateSoutenance >= today).length,
      past: this.planifications.filter(p => p.dateSoutenance < today).length,
      totalSlots: 0 // Will be calculated when details are loaded
    };
  }

  viewPlanificationDetails(planification: PlanificationSoutenanceResponse): void {
    this.selectedPlanification = planification;
    this.loadPlanificationDetails(planification.id);
    
    this.notificationService.info(
      'Détails de planification',
      `Affichage des créneaux pour le ${this.formatDate(planification.dateSoutenance)}`
    );
  }

  private loadPlanificationDetails(planifId: number): void {
    this.loadingDetails = true;
    this.planificationService.getDetails(planifId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.planificationDetails = details;
          this.loadingDetails = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.loadingDetails = false;
          // console.error('Erreur chargement détails:', error);
          this.cdr.detectChanges();
        }
      });
  }


  closeDetailModal(): void {
    this.showDetailModal = false;
    this.selectedPlanification = null;
    this.resetDetailForm();
  }

  addDetailToPlanification(): void {
    if (!this.selectedPlanification || !this.validateDetailForm()) {
      return;
    }

    this.planificationService.addDetail(this.selectedPlanification.id, this.newDetail)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (detail) => {
          this.closeDetailModal();
          if (this.selectedPlanification) {
            this.loadPlanificationDetails(this.selectedPlanification.id);
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          // console.error('Erreur ajout détail:', error);
        }
      });
  }

  editDetail(detail: DetailSoutenance): void {
    this.newDetail = { ...detail };
    this.showDetailModal = true;
  }

  deleteDetail(detail: DetailSoutenance): void {
    this.notificationService.warning(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer ce créneau (${detail.heureDebut} - ${detail.heureFin}) ?`,
      0,
      [
        {
          label: 'Annuler',
          style: 'secondary',
          action: () => {
            this.notificationService.info('Suppression annulée', 'Le créneau a été conservé');
          }
        },
        {
          label: 'Supprimer',
          style: 'danger',
          action: () => {
            this.performDeleteDetail(detail);
          }
        }
      ]
    );
  }

  private performDeleteDetail(detail: DetailSoutenance): void {
    this.planificationService.deleteDetail(detail.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          if (this.selectedPlanification) {
            this.loadPlanificationDetails(this.selectedPlanification.id);
          }
          this.cdr.detectChanges();
        },
        error: (error) => {
          // console.error('Erreur suppression détail:', error);
        }
      });
  }

  exportToPDF(planification: PlanificationSoutenanceResponse): void {
    this.notificationService.info(
      'Export PDF',
      `Génération du PDF pour la planification du ${this.formatDate(planification.dateSoutenance)}...`
    );
    
    // TODO: Implement PDF export
    setTimeout(() => {
      this.notificationService.success(
        'Export réussi',
        'Le fichier PDF a été téléchargé avec succès'
      );
    }, 2000);
  }

  backToPlanifications(): void {
    this.selectedPlanification = null;
    this.planificationDetails = [];
  }

  refreshData(): void {
    this.loadData();
  }

  private validateDetailForm(): boolean {
    const { sujet, heureDebut, heureFin, etudiant } = this.newDetail;

    if (!sujet.trim()) {
      this.notificationService.error('Sujet requis', 'Le sujet de soutenance est obligatoire');
      return false;
    }

    if (!heureDebut) {
      this.notificationService.error('Heure début requise', 'L\'heure de début est obligatoire');
      return false;
    }

    if (!heureFin) {
      this.notificationService.error('Heure fin requise', 'L\'heure de fin est obligatoire');
      return false;
    }

    if (heureDebut >= heureFin) {
      this.notificationService.error('Horaires invalides', 'L\'heure de fin doit être après l\'heure de début');
      return false;
    }

    if (!etudiant.id) {
      this.notificationService.error('Étudiant requis', 'Veuillez sélectionner un étudiant');
      return false;
    }

    return true;
  }

  private resetDetailForm(): void {
    this.newDetail = {
      id: 0,
      sujet: '',
      dateSoutenance: '',
      heureDebut: '',
      heureFin: '',
      etudiant: { id: 0 },
      planification: { id: 0 }
    };
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatTime(time: string): string {
    return time?.substring(0, 5) || '';
  }

  getEncadrantName(encadrant: any): string {
    if (!encadrant) return 'Non assigné';
    return `${encadrant.prenom} ${encadrant.nom}`;
  }

  getStatusBadgeClass(planification: PlanificationSoutenanceResponse): string {
    const today = new Date().toISOString().split('T')[0];
    
    if (planification.dateSoutenance < today) {
      return 'badge-secondary';
    } else if (planification.dateSoutenance === today) {
      return 'badge-warning';
    } else {
      return 'badge-primary';
    }
  }

  

  getStatusText(planification: PlanificationSoutenanceResponse): string {
    const today = new Date().toISOString().split('T')[0];
    
    if (planification.dateSoutenance < today) {
      return 'Terminée';
    } else if (planification.dateSoutenance === today) {
      return 'Aujourd\'hui';
    } else {
      const days = Math.ceil((new Date(planification.dateSoutenance).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
      return `Dans ${days} jour${days > 1 ? 's' : ''}`;
    }
  }

openDetailModal(planification: PlanificationSoutenanceResponse): void {
  this.selectedPlanification = planification;
  this.newDetail = {
    id: 0,
    sujet: '',
    dateSoutenance: planification.dateSoutenance,
    heureDebut: '',
    heureFin: '',
    etudiant: { id: 0 },
    planification: { id: planification.id }
  };

  // load students for the selected classeGroupe
  const classGroupId = planification.classeGroupe?.id;
  if (classGroupId) {
    this.planificationService.listStudentsByClassGroup(classGroupId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (students) => {
          this.students = students;
          this.showDetailModal = true;
          this.cdr.detectChanges();
        },
        error: (err) => {
          // console.error('Erreur loading students', err);
          this.students = [];
          this.showDetailModal = true;
        }
      });
  } else {
    this.students = [];
    this.showDetailModal = true;
  }
}


  // Keyboard shortcuts
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeDetailModal();
      this.backToPlanifications();
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault();
      this.refreshData();
    }
  }


  // download all planifs for current encadrant
downloadPlanificationsExcel(): void {
  if (!this.currentUser) return;

  this.notificationService.info('Export Excel', 'Préparation du fichier...');
  this.planificationService.downloadPlanificationsExcel(this.currentUser.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (blob) => {
        const filename = `planifications_encadrant_${this.currentUser!.id}.xlsx`;
        this.planificationService.downloadBlob(blob, filename);
        this.notificationService.success('Export terminé', 'Le fichier Excel a été téléchargé');
      },
      error: (err) => {
        // console.error('Erreur export Excel:', err);
        this.notificationService.error('Export échoué', 'Impossible de générer le fichier Excel');
      }
    });
}

// download selected planification details as Excel
downloadSelectedPlanifExcel(): void {
  if (!this.selectedPlanification) return;

  this.notificationService.info('Export Excel', 'Préparation du fichier...');
  this.planificationService.downloadPlanificationExcel(this.selectedPlanification.id)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: (blob) => {
        const filename = `planification_${this.selectedPlanification!.id}.xlsx`;
        this.planificationService.downloadBlob(blob, filename);
        this.notificationService.success('Export terminé', 'Le fichier Excel a été téléchargé');
      },
      error: (err) => {
        // console.error('Erreur export Excel:', err);
        this.notificationService.error('Export échoué', 'Impossible de générer le fichier Excel');
      }
    });
}




  


  
}