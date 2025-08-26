

// import { Component, type OnInit, type OnDestroy, ChangeDetectionStrategy } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import { RouterModule } from "@angular/router"
// import { Subject, takeUntil } from "rxjs"

// import  { AuthService } from "../../../services/auth.service"
// import  { StageService } from "../../../services/stage.service"
// import  { UserService } from "../../../services/user.service"
// import  { NotificationService } from "../../../services/notification.service"
// import { NavbarComponent } from "../../shared/navbar/navbar.component"
// import { CardComponent } from "../../../shared/components/card/card.component"
// import { LoadingComponent } from "../../../shared/components/loading/loading.component"
// import {
//   EmptyStateComponent,
//   type EmptyStateAction,
// } from "../../../shared/components/empty-state/empty-state.component"

// import type { User } from "../../../models/user.model"
// import type { Stage, AssignmentRequest , GroupAssignmentRequest } from "../../../models/stage.model"

// interface DashboardStats {
//   total: number
//   enAttente: number
//   valides: number
//   refuses: number
//   enCours: number
//   totalEtudiants: number
//   totalEncadrants: number
// }

// interface ChartData {
//   stagesByStatus: Array<{
//     name: string
//     value: number
//     color: string
//   }>
//   monthlyTrends: Array<{
//     month: string
//     stages: number
//     validations: number
//   }>
// }

// @Component({
//   selector: "app-admin-dashboard",
//   standalone: true,
//   imports: [
//     CommonModule,
//     RouterModule,
//     NavbarComponent,
//     FormsModule,
//     CardComponent,
//     LoadingComponent,
//     EmptyStateComponent,
//   ],
//   templateUrl: "./admin-dashboard.component.html",
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   styleUrls: ["./admin-dashboard.component.scss"],
// })
// export class AdminDashboardComponent implements OnInit, OnDestroy {
//   private destroy$ = new Subject<void>()

//   currentUser: User | null = null
//   currentDate = new Date()
//   loading = false
//   creatingAssignment = false
//   searchTerm = ""
//   statusFilter = ""
//   currentPage = 1
//   pageSize = 10
//   showAssignmentModal = false

//   stats: DashboardStats = {
//     total: 0,
//     enAttente: 0,
//     valides: 0,
//     refuses: 0,
//     enCours: 0,
//     totalEtudiants: 0,
//     totalEncadrants: 0,
//   }

//   stages: Stage[] = []
//   filteredStages: Stage[] = []
//   assignments: any[] = []
//   students: User[] = []
//   supervisors: User[] = []

//   newAssignment = {
//     etudiantId: 0,
//     etudiantNom: "",
//     encadrantId: 0,
//     encadrantNom: "",
//   }

//   departements: Array<{ id: number; nom: string }> = [];
//   classGroups:  Array<{ id: number; nom: string }> = [];
//   anneesScolaires: Array<{ id: number; libelle: string }> = []

//  newGroupAssignment: GroupAssignmentRequest = {
//   encadrantId: 0,
//   departementId: 0,
//   classeGroupeId: 0,
//   anneeScolaireId: 0
// }


//   chartData: ChartData = {
//     stagesByStatus: [
//       { name: "En attente", value: 0, color: "#f59e0b" },
//       { name: "Validés", value: 0, color: "#10b981" },
//       { name: "Refusés", value: 0, color: "#ef4444" },
//       { name: "En cours", value: 0, color: "#3b82f6" },
//     ],
//     monthlyTrends: [
//       { month: "Jan", stages: 12, validations: 8 },
//       { month: "Fév", stages: 18, validations: 15 },
//       { month: "Mar", stages: 25, validations: 20 },
//       { month: "Avr", stages: 32, validations: 28 },
//       { month: "Mai", stages: 28, validations: 25 },
//       { month: "Jun", stages: 35, validations: 32 },
//     ],
//   }

//   emptyAssignmentActions: EmptyStateAction[] = [
//     {
//       label: "Créer une affectation",
//       icon: "bi-plus-circle",
//       variant: "primary",
//       action: () => this.openAssignmentModal(),
//     },
//   ]

//   allClassGroups: Array<{ id: number; nom: string }> = []; // Nouvelle propriété
//   loadingAllClassGroups = false;

//   constructor(
//     private authService: AuthService,
//     private stageService: StageService,
//     private userService: UserService,
//     private notificationService: NotificationService,
//   ) {}

//   ngOnInit(): void {
//     this.currentUser = this.authService.getCurrentUser()
//     this.loadData()
//     this.loadStudents()
//     this.loadSupervisors()
//     this.loadAssignments()
//     this.loadDepartements();
//     this.loadAnneesScolaires();
//     this.loadAllClassGroups(); // Charger tous les groupes


//     setTimeout(() => {
//       this.animateCharts()
//     }, 500)
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next()
//     this.destroy$.complete()
//   }

//   loadData(): void {
//     this.loading = true
//     this.stageService
//       .getStageStats()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (stats) => {
//           this.stats = stats
//           this.updateChartData()
//           this.loadStages()
//         },
//         error: (error) => this.handleError(error, "statistiques"),
//       })
//   }

//   updateChartData(): void {
//     this.chartData.stagesByStatus = [
//       { name: "En attente", value: this.stats.enAttente, color: "#f59e0b" },
//       { name: "Validés", value: this.stats.valides, color: "#10b981" },
//       { name: "Refusés", value: this.stats.refuses, color: "#ef4444" },
//       { name: "En cours", value: this.stats.enCours, color: "#3b82f6" },
//     ]
//   }

//   loadStages(): void {
//     this.stageService
//       .getAllStages()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (stages) => {
//           this.stages = stages
//           this.filteredStages = [...stages]
//           this.loading = false
//           this.loadAssignments()
//         },
//         error: (error) => this.handleError(error, "stages"),
//       })
//   }



// // Ajoutez ces propriétés pour suivre l'état de chargement
// loadingDepartements = false;
// loadingClassGroups = false;
// loadingAnnees = false;

// // Modifiez les méthodes de chargement
// loadDepartements(): void {
//   this.loadingDepartements = true;
//   this.stageService.listDepartements()
//     .pipe(takeUntil(this.destroy$))
//     .subscribe({
//       next: deps => {
//         this.departements = deps;
//         this.loadingDepartements = false;
//       },
//       error: err => {
//         console.error("Impossible de charger les départements", err);
//         this.loadingDepartements = false;
//       }
//     });
// }

// loadAnneesScolaires(): void {
//   this.loadingAnnees = true;
//   this.stageService.listAnneesScolaires()
//     .pipe(takeUntil(this.destroy$))
//     .subscribe({
//       next: years => {
//         this.anneesScolaires = years;
//         this.loadingAnnees = false;
//       },
//       error: err => {
//         console.error("Impossible de charger les années", err);
//         this.loadingAnnees = false;
//       }
//     });
// }

// onDepartementChange(depId: number): void {
//   if (!depId) {
//     this.classGroups = [];
//     return;
//   }

//   this.loadingClassGroups = true;
//   this.stageService.listClassGroups(depId)
//     .pipe(takeUntil(this.destroy$))
//     .subscribe({
//       next: groups => {
//         this.classGroups = groups;
//         this.loadingClassGroups = false;
//       },
//       error: err => {
//         console.error("Impossible de charger les groupes", err);
//         this.loadingClassGroups = false;
//       }
//     });
// }

// loadAllClassGroups(): void {
//     this.loadingAllClassGroups = true;
//     this.stageService.listAllClassGroups()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: groups => {
//           this.allClassGroups = groups;
//           this.loadingAllClassGroups = false;
//         },
//         error: err => {
//           console.error("Impossible de charger tous les groupes", err);
//           this.loadingAllClassGroups = false;
//         }
//       });
//   }
 

//   loadAssignments(): void {
//     this.stageService
//       .getAssignments()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (assignments) => {
//           this.assignments = assignments
//         },
//         error: (error) => {
//           console.error("Erreur chargement affectations:", error)
//           this.assignments = []
//         },
//       })
//   }

//   loadStudents(): void {
//     this.userService
//       .getStudents()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (students) => {
//           this.students = students
//         },
//         error: (error) => console.error("Erreur chargement étudiants:", error),
//       })
//   }

//   loadSupervisors(): void {
//     this.userService
//       .getEncadrants()
//       .pipe(takeUntil(this.destroy$))
//       .subscribe({
//         next: (supervisors) => {
//           this.supervisors = supervisors
//         },
//         error: (error) => console.error("Erreur chargement encadrants:", error),
//       })
//   }

//   filterData(): void {
//     this.filteredStages = this.stages.filter((stage) => {
//       const matchesSearch =
//         !this.searchTerm ||
//         stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         stage.filiere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
//         (stage.etudiant?.nom + " " + stage.etudiant?.prenom).toLowerCase().includes(this.searchTerm.toLowerCase())

//       const matchesStatus = !this.statusFilter || stage.etat === this.statusFilter

//       return matchesSearch && matchesStatus
//     })
//     this.currentPage = 1
//   }

//   getPaginatedStages(): Stage[] {
//     const startIndex = (this.currentPage - 1) * this.pageSize
//     return this.filteredStages.slice(startIndex, startIndex + this.pageSize)
//   }

//   getRecentAssignments(): any[] {
//     return this.assignments.slice(0, 5)
//   }

//   getStatusText(status: string): string {
//     const statusMap: Record<string, string> = {
//       EN_ATTENTE: "En attente",
//       VALIDE: "Validé",
//       REFUSE: "Refusé",
//       EN_COURS: "En cours",
//       TERMINE: "Terminé",
//     }
//     return statusMap[status] || status
//   }

//   getStatusBadgeClass(status: string): string {
//     const classMap: Record<string, string> = {
//       EN_ATTENTE: "badge-warning",
//       VALIDE: "badge-success",
//       REFUSE: "badge-error",
//       EN_COURS: "badge-primary",
//       TERMINE: "badge-secondary",
//     }
//     return classMap[status] || "badge-secondary"
//   }

//   get totalPages(): number {
//     return Math.ceil(this.filteredStages.length / this.pageSize)
//   }

//   // createGroupAssignment(): void {
//   // this.stageService
//   //   .assignerEncadrantGroupe(this.newGroupAssignment)
//   //   .pipe(takeUntil(this.destroy$))
//   //   .subscribe({
//   //     next: res => {
//   //       this.notificationService.success(
//   //         'Affectation par groupe',
//   //         res.message
//   //       );
//   //       // rafraîchir la liste ou réinitialiser le form…
//   //     },
//   //     error: err => {
//   //       this.notificationService.error(
//   //         'Erreur affectation groupe',
//   //         err.message
//   //       );
//   //     }
//   //   });
//   // }

//   // Dans votre composant Angular (par exemple, là où vous définissez newGroupAssignment ou avant l'appel)

// createGroupAssignment(): void {
//   console.log('🟢 createGroupAssignment appelé, dto =', this.newGroupAssignment);
//   this.creatingAssignment = true;

//   // Créez un objet payload pour vous assurer que les IDs sont des nombres
//   const payload = {
//     encadrantId: Number(this.newGroupAssignment.encadrantId),
//     departementId: Number(this.newGroupAssignment.departementId),
//     classeGroupeId: Number(this.newGroupAssignment.classeGroupeId),
//     anneeScolaireId: Number(this.newGroupAssignment.anneeScolaireId),
//   };

//   this.stageService
//     .assignerEncadrantGroupe(payload) // Utilisez le payload converti
//     .pipe(takeUntil(this.destroy$))
//     .subscribe({
//       next: res => {
//         console.log('🟢 réponse backend:', res);
//         this.notificationService.success('Affectation par groupe', res.message);
//         this.creatingAssignment = false;
//         this.closeAssignmentModal();
//       },
//       error: err => {
//         console.error('🔴 erreur backend:', err);
//         // Améliorez la gestion des erreurs pour afficher le message d'erreur du backend
//         const errorMessage = err.error?.message || err.message || 'Une erreur inconnue est survenue.';
//         this.notificationService.error('Erreur affectation groupe', errorMessage);
//         this.creatingAssignment = false;
//       }
//     });
// }


//   removeAssignment(assignmentId: number): void {
//     this.notificationService.warning(
//       "Confirmer la suppression",
//       "Êtes-vous sûr de vouloir supprimer cette affectation ?",
//       0,
//       [
//         {
//           label: "Annuler",
//           style: "secondary",
//           action: () => {},
//         },
//         {
//           label: "Supprimer",
//           style: "danger",
//           action: () => {
//             this.stageService
//               .removeAssignment(assignmentId)
//               .pipe(takeUntil(this.destroy$))
//               .subscribe({
//                 next: () => {
//                   this.notificationService.success("Affectation supprimée", "L'affectation a été supprimée avec succès")
//                   this.loadAssignments()
//                 },
//                 error: () =>
//                   this.notificationService.error(
//                     "Erreur de suppression",
//                     "Erreur lors de la suppression de l'affectation",
//                   ),
//               })
//           },
//         },
//       ],
//     )
//   }

//   openAssignmentModal(): void {
//     this.showAssignmentModal = true
//   }

//   closeAssignmentModal(): void {
//     this.showAssignmentModal = false
//     this.newAssignment = {
//       etudiantId: 0,
//       etudiantNom: "",
//       encadrantId: 0,
//       encadrantNom: "",
//     }
//   }

//   animateCharts(): void {
//     const bars = document.querySelectorAll(".chart-bar .bar-fill")
//     bars.forEach((bar, index) => {
//       setTimeout(() => {
//         ;(bar as HTMLElement).style.height = (bar as HTMLElement).dataset["height"] || "0%"
//       }, index * 200)
//     })

//     const pieSegments = document.querySelectorAll(".pie-segment")
//     pieSegments.forEach((segment, index) => {
//       setTimeout(() => {
//         segment.classList.add("animate")
//       }, index * 300)
//     })
//   }

//   getPercentage(value: number): number {
//     const total = this.chartData.stagesByStatus.reduce((sum, item) => sum + item.value, 0)
//     return total > 0 ? (value / total) * 100 : 0
//   }

//   getMaxValue(): number {
//     return Math.max(...this.chartData.monthlyTrends.map((item) => Math.max(item.stages, item.validations)))
//   }

//   getBarHeight(value: number): number {
//     const max = this.getMaxValue()
//     return max > 0 ? (value / max) * 100 : 0
//   }

//   private handleError(error: any, context: string): void {
//     this.loading = false
//     this.notificationService.error(`Erreur ${context}`, error.message)
//     if (error.status === 401) {
//       this.authService.logout()
//     }
//   }

//   previousPage(): void {
//     if (this.currentPage > 1) {
//       this.currentPage--
//     }
//   }

//   nextPage(): void {
//     if (this.currentPage < this.totalPages) {
//       this.currentPage++
//     }
//   }

//   goToPage(page: number): void {
//     this.currentPage = page
//   }
// }


import { Component, type OnInit, type OnDestroy, ChangeDetectionStrategy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { RouterModule } from "@angular/router"
import { Subject, takeUntil } from "rxjs"

import  { AuthService } from "../../../services/auth.service"
import  { StageService } from "../../../services/stage.service"
import  { UserService } from "../../../services/user.service"
import  { NotificationService } from "../../../services/notification.service"
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { NotificationComponent } from "../../../shared/components/notification/notification.component"
import { CardComponent } from "../../../shared/components/card/card.component"
import { LoadingComponent } from "../../../shared/components/loading/loading.component"
import {
  EmptyStateComponent,
  type EmptyStateAction,
} from "../../../shared/components/empty-state/empty-state.component"

import type { User } from "../../../models/user.model"
import type { Stage, AssignmentRequest , GroupAssignmentRequest } from "../../../models/stage.model"

interface DashboardStats {
  total: number
  enAttente: number
  valides: number
  refuses: number
  enCours: number
  totalEtudiants: number
  totalEncadrants: number
}

interface ChartData {
  stagesByStatus: Array<{
    name: string
    value: number
    color: string
  }>
  monthlyTrends: Array<{
    month: string
    stages: number
    validations: number
  }>
}

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    FormsModule,
    CardComponent,
    LoadingComponent,
    EmptyStateComponent,
  ],
  templateUrl: "./admin-dashboard.component.html",
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  currentUser: User | null = null
  currentDate = new Date()
  loading = false
  creatingAssignment = false
  searchTerm = ""
  statusFilter = ""
  currentPage = 1
  pageSize = 10
  showAssignmentModal = false

  stats: DashboardStats = {
    total: 0,
    enAttente: 0,
    valides: 0,
    refuses: 0,
    enCours: 0,
    totalEtudiants: 0,
    totalEncadrants: 0,
  }

  stages: Stage[] = []
  filteredStages: Stage[] = []
  assignments: any[] = []
  students: User[] = []
  supervisors: User[] = []

  newAssignment = {
    etudiantId: 0,
    etudiantNom: "",
    encadrantId: 0,
    encadrantNom: "",
  }

  departements: Array<{ id: number; nom: string }> = [];
  classGroups:  Array<{ id: number; nom: string }> = [];
  anneesScolaires: Array<{ id: number; libelle: string }> = []

 newGroupAssignment: GroupAssignmentRequest = {
  encadrantId: 0,
  departementId: 0,
  classeGroupeId: 0,
  anneeScolaireId: 0
}


  chartData: ChartData = {
    stagesByStatus: [
      { name: "En attente", value: 0, color: "#f59e0b" },
      { name: "Validés", value: 0, color: "#10b981" },
      { name: "Refusés", value: 0, color: "#ef4444" },
      { name: "En cours", value: 0, color: "#3b82f6" },
    ],
    monthlyTrends: [
      { month: "Jan", stages: 12, validations: 8 },
      { month: "Fév", stages: 18, validations: 15 },
      { month: "Mar", stages: 25, validations: 20 },
      { month: "Avr", stages: 32, validations: 28 },
      { month: "Mai", stages: 28, validations: 25 },
      { month: "Jun", stages: 35, validations: 32 },
    ],
  }

  emptyAssignmentActions: EmptyStateAction[] = [
    {
      label: "Créer une affectation",
      icon: "bi-plus-circle",
      variant: "primary",
      action: () => this.openAssignmentModal(),
    },
  ]

  allClassGroups: Array<{ id: number; nom: string }> = []; // Nouvelle propriété
  loadingAllClassGroups = false;

  constructor(
    private authService: AuthService,
    private stageService: StageService,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser()
    this.notificationService.info('Tableau de bord', 'Chargement du tableau de bord administrateur...')
    
    this.loadData()
    this.loadStudents()
    this.loadSupervisors()
    this.loadAssignments()
    this.loadDepartements();
    this.loadAnneesScolaires();
    this.loadAllClassGroups(); // Charger tous les groupes


    setTimeout(() => {
      this.animateCharts()
    }, 500)
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadData(): void {
    this.loading = true
    this.notificationService.info('Chargement', 'Récupération des statistiques...')
    
    this.stageService
      .getStageStats()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stats) => {
          this.stats = stats
          this.updateChartData()
          this.loadStages()
          this.notificationService.success('Statistiques', 'Données statistiques chargées avec succès')
        },
        error: (error) => this.handleError(error, "statistiques"),
      })
  }

  updateChartData(): void {
    this.chartData.stagesByStatus = [
      { name: "En attente", value: this.stats.enAttente, color: "#f59e0b" },
      { name: "Validés", value: this.stats.valides, color: "#10b981" },
      { name: "Refusés", value: this.stats.refuses, color: "#ef4444" },
      { name: "En cours", value: this.stats.enCours, color: "#3b82f6" },
    ]
  }

  loadStages(): void {
    this.notificationService.info('Chargement', 'Récupération de la liste des stages...')
    
    this.stageService
      .getAllStages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages
          this.filteredStages = [...stages]
          this.loading = false
          this.loadAssignments()
          this.notificationService.success('Stages', `${stages.length} stages chargés avec succès`)
        },
        error: (error) => this.handleError(error, "stages"),
      })
  }



// Ajoutez ces propriétés pour suivre l'état de chargement
loadingDepartements = false;
loadingClassGroups = false;
loadingAnnees = false;

// Modifiez les méthodes de chargement
loadDepartements(): void {
  this.loadingDepartements = true;
  this.notificationService.info('Chargement', 'Récupération des départements...')
  
  this.stageService.listDepartements()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: deps => {
        this.departements = deps;
        this.loadingDepartements = false;
        this.notificationService.success('Départements', `${deps.length} départements chargés`)
      },
      error: err => {
        // console.error("Impossible de charger les départements", err);
        this.loadingDepartements = false;
        this.notificationService.error('Erreur', 'Impossible de charger les départements')
      }
    });
}

loadAnneesScolaires(): void {
  this.loadingAnnees = true;
  this.notificationService.info('Chargement', 'Récupération des années scolaires...')
  
  this.stageService.listAnneesScolaires()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: years => {
        this.anneesScolaires = years;
        this.loadingAnnees = false;
        this.notificationService.success('Années scolaires', `${years.length} années chargées`)
      },
      error: err => {
        // console.error("Impossible de charger les années", err);
        this.loadingAnnees = false;
        this.notificationService.error('Erreur', 'Impossible de charger les années scolaires')
      }
    });
}

onDepartementChange(depId: number): void {
  if (!depId) {
    this.classGroups = [];
    return;
  }

  this.loadingClassGroups = true;
  this.notificationService.info('Chargement', 'Récupération des groupes de classe...')
  
  this.stageService.listClassGroups(depId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: groups => {
        this.classGroups = groups;
        this.loadingClassGroups = false;
        this.notificationService.success('Groupes', `${groups.length} groupes chargés pour ce département`)
      },
      error: err => {
        // console.error("Impossible de charger les groupes", err);
        this.loadingClassGroups = false;
        this.notificationService.error('Erreur', 'Impossible de charger les groupes de classe')
      }
    });
}

loadAllClassGroups(): void {
    this.loadingAllClassGroups = true;
    this.notificationService.info('Chargement', 'Récupération de tous les groupes...')
    
    this.stageService.listAllClassGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: groups => {
          this.allClassGroups = groups;
          this.loadingAllClassGroups = false;
          this.notificationService.success('Groupes', `${groups.length} groupes disponibles`)
        },
        error: err => {
          // console.error("Impossible de charger tous les groupes", err);
          this.loadingAllClassGroups = false;
          this.notificationService.error('Erreur', 'Impossible de charger tous les groupes')
        }
      });
  }
 

  loadAssignments(): void {
    this.notificationService.info('Chargement', 'Récupération des affectations...')
    
    this.stageService
      .getAssignments()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (assignments) => {
          this.assignments = assignments
          this.notificationService.success('Affectations', `${assignments.length} affectations trouvées`)
        },
        error: (error) => {
          // console.error("Erreur chargement affectations:", error)
          this.assignments = []
          this.notificationService.error('Erreur', 'Impossible de charger les affectations')
        },
      })
  }

  loadStudents(): void {
    this.notificationService.info('Chargement', 'Récupération des étudiants...')
    
    this.userService
      .getStudents()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (students) => {
          this.students = students
          this.notificationService.success('Étudiants', `${students.length} étudiants chargés`)
        },
        error: (error) => {
          // console.error("Erreur chargement étudiants:", error)
          this.notificationService.error('Erreur', 'Impossible de charger les étudiants')
        },
      })
  }

  loadSupervisors(): void {
    this.notificationService.info('Chargement', 'Récupération des encadrants...')
    
    this.userService
      .getEncadrants()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (supervisors) => {
          this.supervisors = supervisors
          this.notificationService.success('Encadrants', `${supervisors.length} encadrants chargés`)
        },
        error: (error) => {
          // console.error("Erreur chargement encadrants:", error)
          this.notificationService.error('Erreur', 'Impossible de charger les encadrants')
        },
      })
  }

  filterData(): void {
    this.notificationService.info('Filtrage', 'Application des filtres de recherche...')
    
    this.filteredStages = this.stages.filter((stage) => {
      const matchesSearch =
        !this.searchTerm ||
        stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stage.filiere.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (stage.etudiant?.nom + " " + stage.etudiant?.prenom).toLowerCase().includes(this.searchTerm.toLowerCase())

      const matchesStatus = !this.statusFilter || stage.etat === this.statusFilter

      return matchesSearch && matchesStatus
    })
    this.currentPage = 1
    
    this.notificationService.success('Filtrage', `${this.filteredStages.length} résultats trouvés`)
  }

  getPaginatedStages(): Stage[] {
    const startIndex = (this.currentPage - 1) * this.pageSize
    return this.filteredStages.slice(startIndex, startIndex + this.pageSize)
  }

  getRecentAssignments(): any[] {
    return this.assignments.slice(0, 5)
  }

  getStatusText(status: string): string {
    const statusMap: Record<string, string> = {
      EN_ATTENTE: "En attente",
      VALIDE: "Validé",
      REFUSE: "Refusé",
      EN_COURS: "En cours",
      TERMINE: "Terminé",
    }
    return statusMap[status] || status
  }

  getStatusBadgeClass(status: string): string {
    const classMap: Record<string, string> = {
      EN_ATTENTE: "badge-warning",
      VALIDE: "badge-success",
      REFUSE: "badge-error",
      EN_COURS: "badge-primary",
      TERMINE: "badge-secondary",
    }
    return classMap[status] || "badge-secondary"
  }

  get totalPages(): number {
    return Math.ceil(this.filteredStages.length / this.pageSize)
  }

createGroupAssignment(): void {
  // console.log('🟢 createGroupAssignment appelé, dto =', this.newGroupAssignment);
  this.creatingAssignment = true;

  this.notificationService.info('Affectation', 'Création de l\'affectation par groupe en cours...')

  // Créez un objet payload pour vous assurer que les IDs sont des nombres
  const payload = {
    encadrantId: Number(this.newGroupAssignment.encadrantId),
    departementId: Number(this.newGroupAssignment.departementId),
    classeGroupeId: Number(this.newGroupAssignment.classeGroupeId),
    anneeScolaireId: Number(this.newGroupAssignment.anneeScolaireId),
  };

  this.stageService
    .assignerEncadrantGroupe(payload) // Utilisez le payload converti
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: res => {
        // console.log('🟢 réponse backend:', res);
this.notificationService.success('Affectation réussie', res.message || 'Affectation par groupe créée avec succès');
        this.creatingAssignment = false;
        this.closeAssignmentModal();
        this.loadAssignments(); // Recharger les affectations
      },
      error: err => {
        // console.error('🔴 erreur backend:', err);
        // Améliorez la gestion des erreurs pour afficher le message d'erreur du backend
        const errorMessage = err.error?.message || err.message || 'Une erreur inconnue est survenue.';
        this.notificationService.error('Erreur d\'affectation', errorMessage);
        this.creatingAssignment = false;
      }
    });
}


  removeAssignment(assignmentId: number): void {
    this.notificationService.warning(
      "Confirmer la suppression",
      "Êtes-vous sûr de vouloir supprimer cette affectation ?",
      0,
      [
        {
          label: "Annuler",
          style: "secondary",
          action: () => {
            this.notificationService.info('Annulation', 'Suppression annulée')
          },
        },
        {
          label: "Supprimer",
          style: "danger",
         action: () => {
  this.stageService
    .removeAssignment(assignmentId)
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: () => {
        this.notificationService.success("Suppression réussie", "L'affectation a été supprimée avec succès");
        this.loadAssignments();
      },
      error: () => {
        this.notificationService.error("Erreur", "Échec de la suppression de l'affectation");
      },
    });
}

        },
      ],
    )
  }

  openAssignmentModal(): void {
    this.showAssignmentModal = true
    this.notificationService.info('Modal', 'Ouverture du formulaire d\'affectation')
  }

  closeAssignmentModal(): void {
    this.showAssignmentModal = false
    this.newAssignment = {
      etudiantId: 0,
      etudiantNom: "",
      encadrantId: 0,
      encadrantNom: "",
    }
    this.notificationService.info('Modal', 'Fermeture du formulaire d\'affectation')
  }

  animateCharts(): void {
    const bars = document.querySelectorAll(".chart-bar .bar-fill")
    bars.forEach((bar, index) => {
      setTimeout(() => {
        ;(bar as HTMLElement).style.height = (bar as HTMLElement).dataset["height"] || "0%"
      }, index * 200)
    })

    const pieSegments = document.querySelectorAll(".pie-segment")
    pieSegments.forEach((segment, index) => {
      setTimeout(() => {
        segment.classList.add("animate")
      }, index * 300)
    })
  }

  getPercentage(value: number): number {
    const total = this.chartData.stagesByStatus.reduce((sum, item) => sum + item.value, 0)
    return total > 0 ? (value / total) * 100 : 0
  }

  getMaxValue(): number {
    return Math.max(...this.chartData.monthlyTrends.map((item) => Math.max(item.stages, item.validations)))
  }

  getBarHeight(value: number): number {
    const max = this.getMaxValue()
    return max > 0 ? (value / max) * 100 : 0
  }

  private handleError(error: any, context: string): void {
    this.loading = false
    this.notificationService.error(`Erreur ${context}`, error.message)
    if (error.status === 401) {
      this.authService.logout()
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--
      this.notificationService.info('Navigation', `Page ${this.currentPage}`)
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++
      this.notificationService.info('Navigation', `Page ${this.currentPage}`)
    }
  }

  goToPage(page: number): void {
    this.currentPage = page
    this.notificationService.info('Navigation', `Navigation vers la page ${page}`)
  }
}