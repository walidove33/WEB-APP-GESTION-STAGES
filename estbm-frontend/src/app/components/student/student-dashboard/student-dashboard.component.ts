import { Component, type OnInit, type OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { Subject, takeUntil, timer } from "rxjs"

import { StageService } from "../../../services/stage.service"
import { PlanificationService } from "../../../services/planification.service"
import { AuthService } from "../../../services/auth.service"
import { NotificationService } from "../../../services/notification.service"
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { CardComponent } from "../../../shared/components/card/card.component"
import { LoadingComponent } from "../../../shared/components/loading/loading.component"
import {
  EmptyStateComponent,
  type EmptyStateAction,
} from "../../../shared/components/empty-state/empty-state.component"

import { type Stage, EtatStage, type Rapport, type SoutenanceEtudiantSlotDto } from "../../../models/stage.model"
import type { User } from "../../../models/user.model"

@Component({
  selector: "app-student-dashboard",
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, CardComponent, LoadingComponent, EmptyStateComponent],
  templateUrl: "./student-dashboard.component.html",
  styleUrls: ["./student-dashboard.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentDashboardComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  currentUser: User | null = null
  stages: Stage[] = []
  existingRapport: Rapport | null = null
  soutenances: SoutenanceEtudiantSlotDto[] = []
  nextSoutenance: SoutenanceEtudiantSlotDto | null = null
  loading = true
  submittingReport = false
  selectedFile: File | null = null
  currentDate = new Date()

  stats = {
    total: 0,
    enAttente: 0,
    valides: 0,
    refuses: 0,
    enCours: 0,
    termines: 0,
    totalSoutenances: 0,
    prochaineSoutenance: false
  }

  emptyStateActions: EmptyStateAction[] = [
    {
      label: "Créer ma première demande",
      icon: "bi-plus-circle",
      variant: "primary",
      action: () => {
        this.notificationService.info('Navigation', 'Redirection vers le formulaire de demande...')
        // Navigation will be handled by router
      },
    },
  ]

  constructor(
    private stageService: StageService,
    private planificationService: PlanificationService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {
    this.currentUser = this.authService.getCurrentUser()
  }

  ngOnInit(): void {
    // Welcome message with user name
    if (this.currentUser) {
      this.notificationService.info(
        `Bienvenue ${this.currentUser.prenom} !`,
        'Chargement de votre tableau de bord étudiant...'
      )
    }

    this.loadData()
    this.animateElements()
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  private loadData(): void {
    this.loading = true
    this.cdr.markForCheck()

    this.stageService
      .getMyStages()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (stages) => {
          this.stages = stages || []
          this.calculateStats()
          this.loadExistingRapport()
          this.loadSoutenances()
          this.loading = false
          this.cdr.markForCheck()
          
          // Animate stats after loading
          setTimeout(() => this.animateStats(), 300)
        },
        error: (error) => {
          this.loading = false
          this.cdr.markForCheck()
          // console.error("Error loading stages:", error)
        },
      })
  }

  private loadSoutenances(): void {
    if (!this.currentUser) return;

    this.planificationService.getByEtudiant(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (soutenances) => {
          this.soutenances = soutenances;
          this.findNextSoutenance();
          this.updateSoutenanceStats();
          this.cdr.detectChanges();
        },
        error: (error) => {
          // console.error('Erreur chargement soutenances:', error);
        }
      });
  }

  private findNextSoutenance(): void {
    const today = new Date().toISOString().split('T')[0];
    const upcoming = this.soutenances
      .filter(s => s.date >= today)
      .sort((a, b) => {
        const dateCompare = a.date.localeCompare(b.date);
        if (dateCompare === 0) {
          return a.heureDebut.localeCompare(b.heureDebut);
        }
        return dateCompare;
      });

    this.nextSoutenance = upcoming.length > 0 ? upcoming[0] : null;
  }

  private updateSoutenanceStats(): void {
    this.stats.totalSoutenances = this.soutenances.length;
    this.stats.prochaineSoutenance = this.nextSoutenance !== null;
  }

  private loadExistingRapport(): void {
    const currentStage = this.getCurrentStage()
    if (currentStage) {
      this.stageService
        .getExistingRapport(currentStage.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (rapport) => {
            this.existingRapport = rapport
            this.cdr.markForCheck()
            
            if (rapport) {
              this.notificationService.info(
                'Rapport existant',
                `Rapport "${rapport.nom}" déjà soumis`
              )
            }
          },
          error: () => {
            this.existingRapport = null
            this.cdr.markForCheck()
          },
        })
    }
  }

  private calculateStats(): void {
    this.stats = {
      total: this.stages.length,
      enAttente: this.stages.filter((s) => s.etat === EtatStage.EN_ATTENTE_VALIDATION).length,
      valides: this.stages.filter((s) => s.etat === EtatStage.ACCEPTE || s.etat === EtatStage.RAPPORT_SOUMIS).length,
      refuses: this.stages.filter((s) => s.etat === EtatStage.REFUSE).length,
      enCours: this.stages.filter((s) => s.etat === EtatStage.EN_COURS).length,
      termines: this.stages.filter((s) => s.etat === EtatStage.TERMINE).length,
      totalSoutenances: this.stats.totalSoutenances || 0,
      prochaineSoutenance: this.stats.prochaineSoutenance || false
    }

    // Show stats summary
    if (this.stats.total > 0) {
      this.notificationService.success(
        'Données chargées',
        `${this.stats.total} stage(s): ${this.stats.valides} validé(s), ${this.stats.enAttente} en attente`
      )
    }
  }

  private animateElements(): void {
    setTimeout(() => {
      const cards = document.querySelectorAll(".stat-card")
      cards.forEach((card, index) => {
        setTimeout(() => {
          card.classList.add("animate-slideInUp")
        }, index * 150)
      })
    }, 100)
  }

  private animateStats(): void {
    // Animate stat numbers counting up
    const statValues = document.querySelectorAll('.stat-value')
    statValues.forEach((element, index) => {
      const finalValue = parseInt(element.textContent || '0')
      let currentValue = 0
      const increment = Math.ceil(finalValue / 20)
      
      const counter = setInterval(() => {
        currentValue += increment
        if (currentValue >= finalValue) {
          currentValue = finalValue
          clearInterval(counter)
          
          // Add bounce animation when complete
          element.classList.add('animate-bounce')
          setTimeout(() => {
            element.classList.remove('animate-bounce')
          }, 700)
        }
        element.textContent = currentValue.toString()
      }, 50)
    })
  }

  getCurrentStage(): Stage | null {
    const activeStages = this.stages.filter((stage) =>
      [EtatStage.EN_ATTENTE_VALIDATION, EtatStage.ACCEPTE, EtatStage.EN_COURS, EtatStage.RAPPORT_SOUMIS].includes(
        stage.etat,
      ),
    )
    return activeStages.length > 0 ? activeStages[0] : null
  }

  canRequestNewStage(): boolean {
    const activeStages = this.stages.filter((stage) => 
      ["EN_ATTENTE_VALIDATION", "ACCEPTE", "EN_COURS", "RAPPORT_SOUMIS"].includes(stage.etat)
    )
    return activeStages.length === 0
  }

  canSubmitReport(): boolean {
    const current = this.getCurrentStage()
    if (!current) return false

    return [EtatStage.ACCEPTE, EtatStage.EN_COURS, EtatStage.RAPPORT_SOUMIS].includes(current.etat)
  }

  canDownloadDocuments(): boolean {
    const currentStage = this.getCurrentStage()
    if (!currentStage) return false

    return [EtatStage.ACCEPTE, EtatStage.EN_COURS, EtatStage.TERMINE, EtatStage.RAPPORT_SOUMIS].includes(
      currentStage.etat,
    )
  }

  getStatusText(status: EtatStage): string {
    const statusMap: Record<EtatStage, string> = {
      [EtatStage.DEMANDE]: "Demande créée",
      [EtatStage.EN_ATTENTE_VALIDATION]: "En attente de validation",
      [EtatStage.VALIDATION_EN_COURS]: "Validation en cours",
      [EtatStage.ACCEPTE]: "Validé par l'encadrant",
      [EtatStage.REFUSE]: "Refusé",
      [EtatStage.EN_COURS]: "Stage en cours",
      [EtatStage.TERMINE]: "Stage terminé",
      [EtatStage.RAPPORT_SOUMIS]: "Rapport soumis",
    }
    return statusMap[status] || status
  }

  getStatusBadgeClass(status: EtatStage): string {
    const classMap: Record<EtatStage, string> = {
      [EtatStage.DEMANDE]: "badge-neutral",
      [EtatStage.EN_ATTENTE_VALIDATION]: "badge-warning",
      [EtatStage.VALIDATION_EN_COURS]: "badge-accent",
      [EtatStage.ACCEPTE]: "badge-success",
      [EtatStage.REFUSE]: "badge-danger",
      [EtatStage.EN_COURS]: "badge-primary",
      [EtatStage.TERMINE]: "badge-secondary",
      [EtatStage.RAPPORT_SOUMIS]: "badge-info",
    }
    return classMap[status] || "badge-secondary"
  }

  getProgressPercentage(status: string): number {
    if (this.stats.total === 0) return 0
    const count = this.stats[status as keyof typeof this.stats] as number
    return (count / this.stats.total) * 100
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]
    if (!file) return

    // Animate file selection
    this.animateFileSelection()

    // Validation du fichier avec animations
    if (file.type !== "application/pdf") {
      this.notificationService.errorWithShake(
        "Format non supporté", 
        "Seuls les fichiers PDF sont acceptés."
      )
      this.animateFileError()
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      this.notificationService.errorWithShake(
        "Fichier trop volumineux", 
        "Le fichier ne doit pas dépasser 10MB."
      )
      this.animateFileError()
      return
    }

    this.selectedFile = file
    this.cdr.markForCheck()
    
    this.notificationService.successWithBounce(
      "Fichier sélectionné", 
      `${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB) prêt à être soumis.`
    )
    
    this.animateFileSuccess()
  }

  removeSelectedFile(): void {
    this.selectedFile = null
    this.cdr.markForCheck()
    
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ""
    }

    this.notificationService.info('Fichier retiré', 'Sélection annulée')
    this.animateFileRemoval()
  }

  submitReport(): void {
    const currentStage = this.getCurrentStage()
    if (!currentStage || !this.selectedFile) {
      this.notificationService.errorWithShake(
        "Erreur de soumission", 
        "Aucun fichier sélectionné ou stage non trouvé."
      )
      return
    }

    this.submittingReport = true
    this.cdr.markForCheck()
    
    // Animate submit button
    this.animateSubmitButton()

    this.stageService
      .submitRapport(currentStage.id, this.selectedFile)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.submittingReport = false
          this.selectedFile = null
          this.cdr.markForCheck()

          // Success animation
          this.animateSubmitSuccess()
          
          // Reload data
          this.loadData()
        },
        error: (error) => {
          this.submittingReport = false
          this.cdr.markForCheck()
          
          // Error animation
          this.animateSubmitError()
          // console.error("Error submitting report:", error)
        },
      })
  }

  downloadConvention(stageId: number): void {
    this.animateDownloadButton('convention')
    
    this.stageService
      .downloadConvention(stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `convention_stage_${stageId}.pdf`)
          this.animateDownloadSuccess()
        },
        error: () => {
          this.animateDownloadError()
        },
      })
  }

  downloadAssurance(stageId: number): void {
    this.animateDownloadButton('assurance')
    
    this.stageService
      .downloadAssurance(stageId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          this.downloadFile(blob, `assurance_stage_${stageId}.pdf`)
          this.animateDownloadSuccess()
        },
        error: () => {
          this.animateDownloadError()
        },
      })
  }

  downloadExistingReport(): void {
    if (this.existingRapport?.cloudinaryUrl) {
      this.notificationService.info('Téléchargement', 'Ouverture du rapport dans un nouvel onglet...')
      
      // Animate download
      this.animateDownloadButton('rapport')
      
      setTimeout(() => {
        window.open(this.existingRapport!.cloudinaryUrl, "_blank")
        this.animateDownloadSuccess()
      }, 500)
    } else {
      this.notificationService.errorWithShake(
        "Rapport indisponible",
        "Le lien de téléchargement du rapport n'est pas disponible."
      )
    }
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

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement
    fileInput?.click()
    
    this.notificationService.info('Sélection de fichier', 'Choisissez votre rapport PDF...')
  }

  // ==================== ANIMATION METHODS ====================

  private animateFileSelection(): void {
    const uploadZone = document.querySelector('.upload-zone')
    if (uploadZone) {
      uploadZone.classList.add('animate-pulse')
      setTimeout(() => {
        uploadZone.classList.remove('animate-pulse')
      }, 300)
    }
  }

  private animateFileSuccess(): void {
    const uploadZone = document.querySelector('.upload-zone')
    if (uploadZone) {
      uploadZone.classList.add('success-animation')
      setTimeout(() => {
        uploadZone.classList.remove('success-animation')
      }, 700)
    }
  }

  private animateFileError(): void {
    const uploadZone = document.querySelector('.upload-zone')
    if (uploadZone) {
      uploadZone.classList.add('error-animation')
      setTimeout(() => {
        uploadZone.classList.remove('error-animation')
      }, 500)
    }
  }

  private animateFileRemoval(): void {
    const uploadZone = document.querySelector('.upload-zone')
    if (uploadZone) {
      uploadZone.classList.add('animate-fadeIn')
      setTimeout(() => {
        uploadZone.classList.remove('animate-fadeIn')
      }, 300)
    }
  }

  private animateSubmitButton(): void {
    const submitBtn = document.querySelector('.btn-submit')
    if (submitBtn) {
      submitBtn.classList.add('processing-animation')
    }
  }

  private animateSubmitSuccess(): void {
    const submitBtn = document.querySelector('.btn-submit')
    const reportCard = document.querySelector('.report-card')
    
    if (submitBtn) {
      submitBtn.classList.remove('processing-animation')
      submitBtn.classList.add('success-animation')
    }
    
    if (reportCard) {
      reportCard.classList.add('success-animation')
    }

    // Create success particles
    this.createSuccessParticles()
    
    setTimeout(() => {
      if (submitBtn) submitBtn.classList.remove('success-animation')
      if (reportCard) reportCard.classList.remove('success-animation')
    }, 1000)
  }

  private animateSubmitError(): void {
    const submitBtn = document.querySelector('.btn-submit')
    const reportCard = document.querySelector('.report-card')
    
    if (submitBtn) {
      submitBtn.classList.remove('processing-animation')
      submitBtn.classList.add('error-animation')
    }
    
    if (reportCard) {
      reportCard.classList.add('error-animation')
    }
    
    setTimeout(() => {
      if (submitBtn) submitBtn.classList.remove('error-animation')
      if (reportCard) reportCard.classList.remove('error-animation')
    }, 500)
  }

  private animateDownloadButton(type: string): void {
    const button = document.querySelector(`[data-download="${type}"]`)
    if (button) {
      button.classList.add('processing-animation')
    }
  }

  private animateDownloadSuccess(): void {
    const buttons = document.querySelectorAll('[data-download]')
    buttons.forEach(button => {
      button.classList.remove('processing-animation')
      button.classList.add('success-animation')
      setTimeout(() => {
        button.classList.remove('success-animation')
      }, 700)
    })
  }

  private animateDownloadError(): void {
    const buttons = document.querySelectorAll('[data-download]')
    buttons.forEach(button => {
      button.classList.remove('processing-animation')
      button.classList.add('error-animation')
      setTimeout(() => {
        button.classList.remove('error-animation')
      }, 500)
    })
  }

  private createSuccessParticles(): void {
    // Create floating success particles
    const particles = ['🎉', '✨', '🌟', '💫', '⭐']
    
    for (let i = 0; i < 8; i++) {
      setTimeout(() => {
        const particle = document.createElement('div')
        particle.innerHTML = particles[Math.floor(Math.random() * particles.length)]
        particle.style.position = 'fixed'
        particle.style.fontSize = '24px'
        particle.style.pointerEvents = 'none'
        particle.style.zIndex = '9999'
        particle.style.left = Math.random() * window.innerWidth + 'px'
        particle.style.top = Math.random() * window.innerHeight + 'px'
        particle.style.animation = 'float-up 3s ease-out forwards'
        
        document.body.appendChild(particle)
        
        setTimeout(() => {
          if (document.body.contains(particle)) {
            document.body.removeChild(particle)
          }
        }, 3000)
      }, i * 150)
    }
  }

  // ==================== USER INTERACTION METHODS ====================

  onStageCardClick(stage: Stage): void {
    this.notificationService.info(
      'Détails du stage',
      `Stage chez ${stage.entreprise} - Statut: ${this.getStatusText(stage.etat)}`
    )
  }

  onQuickActionClick(action: string): void {
    const actionMessages = {
      'new-stage': 'Redirection vers le formulaire de nouvelle demande...',
      'stages-list': 'Affichage de l\'historique complet de vos stages...',
      'help': 'Ouverture de l\'aide et documentation...'
    }

    this.notificationService.info(
      'Action rapide',
      actionMessages[action as keyof typeof actionMessages] || 'Action en cours...'
    )
  }

  onDocumentHover(docType: string): void {
    const docMessages = {
      'convention': 'Convention de stage officielle signée par toutes les parties',
      'assurance': 'Attestation d\'assurance couvrant la période de stage'
    }

    this.notificationService.info(
      'Document',
      docMessages[docType as keyof typeof docMessages] || 'Document officiel'
    )
  }

  // ==================== PERFORMANCE METHODS ====================

  refreshData(): void {
    this.notificationService.info('Actualisation', 'Rechargement de vos données...')
    this.loadData()
  }

  preloadNextActions(): void {
    // Preload data for likely next actions
    if (this.canRequestNewStage()) {
      // Preload form data
      this.notificationService.info('Optimisation', 'Préparation du formulaire de demande...')
    }
    
    if (this.canSubmitReport()) {
      // Preload upload endpoint
      this.notificationService.info('Optimisation', 'Préparation de l\'upload de rapport...')
    }
  }

  // ==================== ACCESSIBILITY METHODS ====================

  announceStageStatus(): void {
    const currentStage = this.getCurrentStage()
    if (currentStage) {
      const statusText = this.getStatusText(currentStage.etat)
      this.notificationService.info(
        'Statut actuel',
        `Votre stage chez ${currentStage.entreprise} est ${statusText.toLowerCase()}`
      )
    } else {
      this.notificationService.info(
        'Aucun stage actif',
        'Vous n\'avez pas de stage en cours. Créez une nouvelle demande.'
      )
    }
  }

  announceStats(): void {
    const message = `Vous avez ${this.stats.total} stage(s) au total: ${this.stats.valides} validé(s), ${this.stats.enAttente} en attente, ${this.stats.refuses} refusé(s)`
    this.notificationService.info('Statistiques', message)
  }

  // ==================== KEYBOARD SHORTCUTS ====================

  onKeyDown(event: KeyboardEvent): void {
    // Ctrl/Cmd + R: Refresh data
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault()
      this.refreshData()
    }
    
    // Ctrl/Cmd + N: New stage (if allowed)
    if ((event.ctrlKey || event.metaKey) && event.key === 'n' && this.canRequestNewStage()) {
      event.preventDefault()
      this.onQuickActionClick('new-stage')
    }
    
    // Ctrl/Cmd + U: Upload report (if allowed)
    if ((event.ctrlKey || event.metaKey) && event.key === 'u' && this.canSubmitReport()) {
      event.preventDefault()
      this.triggerFileInput()
    }
  }

  // ==================== DRAG & DROP SUPPORT ====================

  onDragOver(event: DragEvent): void {
    event.preventDefault()
    const uploadZone = document.querySelector('.upload-zone')
    if (uploadZone) {
      uploadZone.classList.add('drag-over')
    }
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault()
    const uploadZone = document.querySelector('.upload-zone')
    if (uploadZone) {
      uploadZone.classList.remove('drag-over')
    }
  }

  onDrop(event: DragEvent): void {
    event.preventDefault()
    const uploadZone = document.querySelector('.upload-zone')
    if (uploadZone) {
      uploadZone.classList.remove('drag-over')
    }

    const files = event.dataTransfer?.files
    if (files && files.length > 0) {
      const file = files[0]
      this.onFileSelected({ target: { files: [file] } })
    }
  }

  // ==================== TUTORIAL/ONBOARDING ====================

  startTutorial(): void {
    const steps = [
      'Bienvenue sur votre tableau de bord étudiant !',
      'Ici vous pouvez voir vos statistiques de stages',
      'Consultez le statut de votre stage actuel',
      'Téléchargez vos documents officiels',
      'Soumettez votre rapport de stage',
      'Utilisez les actions rapides pour naviguer'
    ]

    let currentStep = 0
    const showNextStep = () => {
      if (currentStep < steps.length) {
        this.notificationService.info(
          `Tutoriel (${currentStep + 1}/${steps.length})`,
          steps[currentStep],
          5000,
          currentStep < steps.length - 1 ? [{
            label: 'Suivant',
            style: 'primary',
            action: () => {
              currentStep++
              setTimeout(showNextStep, 500)
            }
          }] : [{
            label: 'Terminer',
            style: 'success',
            action: () => {
              this.notificationService.successWithBounce(
                'Tutoriel terminé',
                'Vous êtes maintenant prêt à utiliser votre tableau de bord !'
              )
            }
          }]
        )
      }
    }

    showNextStep()
  }
}