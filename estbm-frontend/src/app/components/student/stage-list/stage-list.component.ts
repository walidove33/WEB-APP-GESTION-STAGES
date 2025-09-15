import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormsModule } from "@angular/forms"
import { Subject, takeUntil } from "rxjs"

import { StageService } from "../../../services/stage.service"
import { NotificationService } from "../../../services/notification.service"
import { AuthService } from "../../../services/auth.service"
import { NavbarComponent } from "../../../shared/components/navbar/navbar.component"
import { LoadingComponent } from "../../../shared/components/loading/loading.component"
import { EmptyStateComponent, EmptyStateAction } from "../../../shared/components/empty-state/empty-state.component"
import { CardComponent } from "../../../shared/components/card/card.component"

import type { Stage, EtatStage } from "../../../models/stage.model"
import type { User } from "../../../models/user.model"

interface StageStats {
  total: number
  enAttente: number
  valides: number
  refuses: number
  enCours: number
  termines: number
  rapportsSoumis: number
}

@Component({
  selector: "app-stage-list",
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    NavbarComponent,
    LoadingComponent,
    EmptyStateComponent,
    CardComponent
  ],
  templateUrl: "./stage-list.component.html",
  styleUrls: ["./stage-list.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StageListComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  currentUser: User | null = null
  stages: Stage[] = []
  filteredStages: Stage[] = []
  loading = false
  searchTerm = ""
  statusFilter = ""
  sortBy = "dateCreation"
  sortDirection: "asc" | "desc" = "desc"

  stats: StageStats = {
    total: 0,
    enAttente: 0,
    valides: 0,
    refuses: 0,
    enCours: 0,
    termines: 0,
    rapportsSoumis: 0
  }

  statusOptions = [
    { value: "", label: "Tous les statuts" },
    { value: "EN_ATTENTE_VALIDATION", label: "En attente" },
    { value: "ACCEPTE", label: "Validé" },
    { value: "REFUSE", label: "Refusé" },
    { value: "EN_COURS", label: "En cours" },
    { value: "TERMINE", label: "Terminé" },
    { value: "RAPPORT_SOUMIS", label: "Rapport soumis" }
  ]

  emptyStateActions: EmptyStateAction[] = [
    {
      label: "Créer ma première demande",
      icon: "bi-plus-circle",
      variant: "primary",
      action: () => this.navigateToNewStage()
    }
  ]

  constructor(
    private stageService: StageService,
    private notificationService: NotificationService,
    private authService: AuthService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser()
  }

  ngOnInit(): void {
    this.notificationService.info(
      'Mes Stages',
      'Chargement de votre historique de stages...'
    )
    this.loadStages()
    this.animateOnLoad()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  loadStages(): void {
    this.loading = true
    this.cdr.markForCheck()

    this.stageService.getMyStages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages || []
          this.calculateStats()
          this.filterAndSortStages()
          this.loading = false
          this.cdr.markForCheck()
          
          this.notificationService.success(
            'Stages chargés',
            `${stages.length} stage(s) trouvé(s) dans votre historique`
          )
        },
        error: (err) => {
          this.loading = false
          this.cdr.markForCheck()
          this.notificationService.error(
            "Erreur de chargement",
            "Impossible de charger vos stages"
          )
        }
      })
  }

  private calculateStats(): void {
    this.stats = {
      total: this.stages.length,
      enAttente: this.stages.filter(s => s.etat === "EN_ATTENTE_VALIDATION").length,
      valides: this.stages.filter(s => s.etat === "ACCEPTE").length,
      refuses: this.stages.filter(s => s.etat === "REFUSE").length,
      enCours: this.stages.filter(s => s.etat === "EN_COURS").length,
      termines: this.stages.filter(s => s.etat === "TERMINE").length,
      rapportsSoumis: this.stages.filter(s => s.etat === "RAPPORT_SOUMIS").length
    }
  }

  filterAndSortStages(): void {
    let filtered = this.stages.filter((stage) => {
      const matchesSearch = !this.searchTerm ||
        stage.sujet.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        stage.entreprise.toLowerCase().includes(this.searchTerm.toLowerCase())

      const matchesStatus = !this.statusFilter || stage.etat === this.statusFilter

      return matchesSearch && matchesStatus
    })

    // Sort stages
    filtered = filtered.sort((a, b) => {
      let aValue: any, bValue: any

      switch (this.sortBy) {
        case "dateCreation":
          aValue = new Date(a.dateCreation || 0).getTime()
          bValue = new Date(b.dateCreation || 0).getTime()
          break
        case "dateDebut":
          aValue = new Date(a.dateDebut).getTime()
          bValue = new Date(b.dateDebut).getTime()
          break
        case "entreprise":
          aValue = a.entreprise.toLowerCase()
          bValue = b.entreprise.toLowerCase()
          break
        case "etat":
          aValue = a.etat
          bValue = b.etat
          break
        default:
          aValue = a.sujet.toLowerCase()
          bValue = b.sujet.toLowerCase()
      }

      if (aValue < bValue) return this.sortDirection === "asc" ? -1 : 1
      if (aValue > bValue) return this.sortDirection === "asc" ? 1 : -1
      return 0
    })

    this.filteredStages = filtered
    this.cdr.markForCheck()
  }

  onSearchChange(): void {
    this.filterAndSortStages()
    this.notificationService.info(
      'Recherche',
      `${this.filteredStages.length} résultat(s) trouvé(s)`
    )
  }

  onStatusFilterChange(): void {
    this.filterAndSortStages()
    const statusLabel = this.statusOptions.find(opt => opt.value === this.statusFilter)?.label || "Tous"
    this.notificationService.info(
      'Filtre appliqué',
      `Affichage: ${statusLabel} (${this.filteredStages.length} résultats)`
    )
  }

  onSortChange(): void {
    this.filterAndSortStages()
  }

  toggleSortDirection(): void {
    this.sortDirection = this.sortDirection === "asc" ? "desc" : "asc"
    this.filterAndSortStages()
  }

  resetFilters(): void {
    this.searchTerm = ""
    this.statusFilter = ""
    this.sortBy = "dateCreation"
    this.sortDirection = "desc"
    this.filterAndSortStages()
    this.notificationService.info('Filtres réinitialisés', 'Affichage de tous vos stages')
  }

  getStatusClass(etat: string): string {
    const statusClasses: Record<string, string> = {
      "EN_ATTENTE_VALIDATION": "badge-warning",
      "ACCEPTE": "badge-success",
      "REFUSE": "badge-danger",
      "EN_COURS": "badge-primary",
      "TERMINE": "badge-secondary",
      "RAPPORT_SOUMIS": "badge-info"
    }
    return statusClasses[etat] || "badge-secondary"
  }

  getStatusText(etat: string): string {
    const statusTexts: Record<string, string> = {
      "EN_ATTENTE_VALIDATION": "En attente",
      "ACCEPTE": "Validé",
      "REFUSE": "Refusé",
      "EN_COURS": "En cours",
      "TERMINE": "Terminé",
      "RAPPORT_SOUMIS": "Rapport soumis"
    }
    return statusTexts[etat] || etat
  }

  getStatusIcon(etat: string): string {
    const statusIcons: Record<string, string> = {
      "EN_ATTENTE_VALIDATION": "bi-clock-history",
      "ACCEPTE": "bi-check-circle-fill",
      "REFUSE": "bi-x-circle-fill",
      "EN_COURS": "bi-play-circle-fill",
      "TERMINE": "bi-check2-circle",
      "RAPPORT_SOUMIS": "bi-file-earmark-check-fill"
    }
    return statusIcons[etat] || "bi-circle"
  }

  downloadConvention(stageId: number): void {
    this.notificationService.info('Téléchargement', 'Préparation de la convention...')
    
    this.stageService.downloadConvention(stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `convention_stage_${stageId}.pdf`)
          this.notificationService.success('Convention téléchargée', 'Document prêt à être utilisé')
        },
        error: () => {
          this.notificationService.error("Erreur", "Impossible de télécharger la convention")
        }
      })
  }

  downloadAssurance(stageId: number): void {
    this.notificationService.info('Téléchargement', 'Préparation de l\'attestation d\'assurance...')
    
    this.stageService.downloadAssurance(stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `assurance_stage_${stageId}.pdf`)
          this.notificationService.success('Assurance téléchargée', 'Document prêt à être utilisé')
        },
        error: () => {
          this.notificationService.error("Erreur", "Impossible de télécharger l'attestation")
        }
      })
  }

  uploadReport(stageId: number): void {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = ".pdf"
    input.onchange = (e: any) => {
      const file: File = e.target.files[0]
      if (!file) return

      // Validation
      if (file.size > 10 * 1024 * 1024) {
        this.notificationService.error("Fichier trop volumineux", "Maximum 10 MB autorisé")
        return
      }

      if (file.type !== "application/pdf") {
        this.notificationService.error("Format non supporté", "Seuls les fichiers PDF sont acceptés")
        return
      }

      this.notificationService.info('Upload', `Soumission du rapport "${file.name}"...`)

      this.stageService.submitRapport(stageId, file)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success("Rapport soumis", "Votre rapport a été envoyé avec succès")
            this.loadStages()
          },
          error: () => {
            this.notificationService.error("Erreur", "Impossible de soumettre le rapport")
          }
        })
    }
    input.click()
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  }

  private navigateToNewStage(): void {
    this.notificationService.info('Navigation', 'Redirection vers le formulaire de nouvelle demande...')
  }

  private animateOnLoad(): void {
    setTimeout(() => {
      const cards = document.querySelectorAll('.stage-card')
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add('animate-slideInUp')
        }, index * 100)
      })
    }, 300)
  }

  // Keyboard shortcuts
  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault()
      this.loadStages()
    }
    
    if (event.key === 'Escape') {
      this.resetFilters()
    }
  }

  // Performance tracking
  trackByStageId(index: number, stage: Stage): number {
    return stage.id
  }

  getProgressPercentage(status: keyof StageStats): number {
    if (this.stats.total === 0) return 0
    return (this.stats[status] / this.stats.total) * 100
  }

  canDownloadDocuments(stage: Stage): boolean {
    return ["ACCEPTE", "EN_COURS", "TERMINE", "RAPPORT_SOUMIS"].includes(stage.etat)
  }

  canSubmitReport(stage: Stage): boolean {
    return ["ACCEPTE", "EN_COURS"].includes(stage.etat)
  }

  getStageProgress(stage: Stage): number {
    const progressMap: Record<string, number> = {
      "EN_ATTENTE_VALIDATION": 20,
      "ACCEPTE": 40,
      "EN_COURS": 60,
      "RAPPORT_SOUMIS": 80,
      "TERMINE": 100,
      "REFUSE": 0
    }
    return progressMap[stage.etat] || 0
  }

  getDaysRemaining(stage: Stage): number {
    const endDate = new Date(stage.dateFin)
    const today = new Date()
    const diffTime = endDate.getTime() - today.getTime()
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  }

  isStageExpiringSoon(stage: Stage): boolean {
    const daysRemaining = this.getDaysRemaining(stage)
    return daysRemaining <= 7 && daysRemaining > 0
  }

  isStageOverdue(stage: Stage): boolean {
    return this.getDaysRemaining(stage) < 0
  }
}