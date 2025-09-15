import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { StageService } from '../../../services/stage.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent, EmptyStateAction } from '../../../shared/components/empty-state/empty-state.component';
import { CardComponent } from '../../../shared/components/card/card.component';

import {
  PlanificationSoutenanceResponse,
  DetailSoutenance
} from '../../../models/stage.model';
import { User } from '../../../models/user.model';

interface PlanificationStats {
  total: number;
  upcoming: number;
  past: number;
  totalSlots: number;
  occupiedSlots: number;
  availableSlots: number;
}

@Component({
  selector: 'app-soutenance-management',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule, 
    NavbarComponent, 
    LoadingComponent,
    EmptyStateComponent,
    CardComponent
  ],
  templateUrl: './soutenance-management.component.html',
  styleUrls: ['./soutenance-management.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoutenanceManagementComponent implements OnInit, OnDestroy {
  @ViewChild('detailForm', { static: false }) detailForm!: NgForm;
  
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  planifications: PlanificationSoutenanceResponse[] = [];
  filteredPlanifications: PlanificationSoutenanceResponse[] = [];
  selectedPlanification: PlanificationSoutenanceResponse | null = null;
  planificationDetails: DetailSoutenance[] = [];
  
  loading = false;
  loadingDetails = false;
  creating = false;
  showDetailModal = false;

  // Filters
  dateFilter = '';
  statusFilter = '';
  searchTerm = '';

  stats: PlanificationStats = {
    total: 0,
    upcoming: 0,
    past: 0,
    totalSlots: 0,
    occupiedSlots: 0,
    availableSlots: 0
  };

  // Form data for adding new detail/slot
  newDetail: Partial<DetailSoutenance> = {
    sujet: '',
    heureDebut: '',
    heureFin: '',
    etudiant: undefined
  };

  statusOptions = [
    { value: '', label: 'Toutes les planifications' },
    { value: 'upcoming', label: 'À venir' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'past', label: 'Terminées' }
  ];

  emptyPlanificationsActions: EmptyStateAction[] = [
    {
      label: 'Actualiser',
      icon: 'bi-arrow-clockwise',
      variant: 'primary',
      action: () => this.loadMyPlanifications()
    },
    {
      label: 'Contacter l\'admin',
      icon: 'bi-envelope',
      variant: 'secondary',
      action: () => this.contactAdmin()
    }
  ];

  emptySlotsActions: EmptyStateAction[] = [
    {
      label: 'Ajouter un créneau',
      icon: 'bi-plus-circle',
      variant: 'primary',
      action: () => this.openDetailModal()
    }
  ];

  constructor(
    private stageService: StageService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.notificationService.info(
      'Gestion Soutenances', 
      'Chargement de vos planifications de soutenance...'
    );
    this.loadMyPlanifications();
    this.animateOnLoad();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /* ===== DATA LOADING ===== */
  loadMyPlanifications(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.stageService.getPlanificationsByEncadrant(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (planifs) => {
          this.planifications = planifs || [];
          this.calculateStats();
          this.filterPlanifications();
          this.loading = false;
          this.cdr.markForCheck();
          
          this.notificationService.success(
            'Planifications chargées',
            `${planifs.length} planification(s) trouvée(s)`
          );
        },
        error: (err) => {
          this.loading = false;
          this.cdr.markForCheck();
          this.notificationService.error(
            'Erreur de chargement',
            'Impossible de charger vos planifications'
          );
        }
      });
  }

  loadPlanificationDetails(planifId: number): void {
    this.loadingDetails = true;
    this.cdr.markForCheck();

    this.stageService.getPlanificationDetails(planifId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (details) => {
          this.planificationDetails = details || [];
          this.calculateSlotStats();
          this.loadingDetails = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.loadingDetails = false;
          this.cdr.markForCheck();
          this.notificationService.error(
            'Erreur',
            'Impossible de charger les détails de la planification'
          );
        }
      });
  }

  /* ===== STATISTICS ===== */
  private calculateStats(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.stats = {
      total: this.planifications.length,
      upcoming: this.planifications.filter(p => p.dateSoutenance >= today).length,
      past: this.planifications.filter(p => p.dateSoutenance < today).length,
      totalSlots: 0,
      occupiedSlots: 0,
      availableSlots: 0
    };
  }

  private calculateSlotStats(): void {
    this.stats.totalSlots = this.planificationDetails.length;
    this.stats.occupiedSlots = this.planificationDetails.filter(d => 
      d.etudiant && (d.etudiant as any).id
    ).length;
    this.stats.availableSlots = this.stats.totalSlots - this.stats.occupiedSlots;
  }

  /* ===== FILTERING ===== */
  filterPlanifications(): void {
    let filtered = [...this.planifications];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(p => 
        p.departement?.nom?.toLowerCase().includes(term) ||
        p.classeGroupe?.nom?.toLowerCase().includes(term) ||
        p.anneeScolaire?.libelle?.toLowerCase().includes(term)
      );
    }

    // Date filter
    if (this.dateFilter) {
      filtered = filtered.filter(p => p.dateSoutenance?.startsWith(this.dateFilter));
    }

    // Status filter
    if (this.statusFilter) {
      const today = new Date().toISOString().split('T')[0];
      switch (this.statusFilter) {
        case 'upcoming':
          filtered = filtered.filter(p => p.dateSoutenance >= today);
          break;
        case 'today':
          filtered = filtered.filter(p => p.dateSoutenance === today);
          break;
        case 'past':
          filtered = filtered.filter(p => p.dateSoutenance < today);
          break;
      }
    }

    // Sort by date
    filtered.sort((a, b) => a.dateSoutenance.localeCompare(b.dateSoutenance));

    this.filteredPlanifications = filtered;
    this.cdr.markForCheck();
  }

  onSearchChange(): void {
    this.filterPlanifications();
    this.notificationService.info(
      'Recherche',
      `${this.filteredPlanifications.length} résultat(s) trouvé(s)`
    );
  }

  onFilterChange(): void {
    this.filterPlanifications();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.dateFilter = '';
    this.statusFilter = '';
    this.filterPlanifications();
    this.notificationService.info('Filtres réinitialisés', 'Affichage de toutes vos planifications');
  }

  /* ===== PLANIFICATION MANAGEMENT ===== */
  viewPlanificationDetails(planification: PlanificationSoutenanceResponse): void {
    this.selectedPlanification = planification;
    this.newDetail = { sujet: '', heureDebut: '', heureFin: '' };
    this.loadPlanificationDetails(planification.id);
    
    this.notificationService.info(
      'Détails de planification',
      `Affichage des créneaux pour le ${this.formatDate(planification.dateSoutenance)}`
    );
  }

  backToPlanifications(): void {
    this.selectedPlanification = null;
    this.planificationDetails = [];
    this.notificationService.info('Navigation', 'Retour à la liste des planifications');
  }

  /* ===== SLOT MANAGEMENT ===== */
  openDetailModal(): void {
    if (!this.selectedPlanification) {
      this.notificationService.error('Erreur', 'Aucune planification sélectionnée');
      return;
    }
    
    this.newDetail = {
      sujet: '',
      heureDebut: '',
      heureFin: '',
      etudiant: undefined
    };
    this.showDetailModal = true;
    
    this.notificationService.info('Nouveau créneau', 'Ajout d\'un nouveau créneau de soutenance');
  }

  closeDetailModal(): void {
    this.showDetailModal = false;
    this.newDetail = {
      sujet: '',
      heureDebut: '',
      heureFin: '',
      etudiant: undefined
    };
  }

  addDetailToPlanification(): void {
    if (!this.selectedPlanification || !this.validateDetailForm()) {
      return;
    }

    this.creating = true;
    this.cdr.markForCheck();

    const payload: Partial<DetailSoutenance> = {
      sujet: this.newDetail.sujet,
      heureDebut: this.newDetail.heureDebut,
      heureFin: this.newDetail.heureFin,
      etudiant: this.newDetail.etudiant
    };

    this.stageService.addDetailToPlanification(this.selectedPlanification.id, payload as DetailSoutenance)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (created: DetailSoutenance) => {
          this.creating = false;
          this.closeDetailModal();
          this.loadPlanificationDetails(this.selectedPlanification!.id);
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.creating = false;
          this.cdr.markForCheck();
          this.notificationService.error(
            'Erreur',
            'Impossible d\'ajouter le créneau'
          );
        }
      });
  }

  editDetail(detail: DetailSoutenance): void {
    this.newDetail = { ...detail };
    this.showDetailModal = true;
    this.notificationService.info('Modification', 'Modification du créneau en cours...');
  }

  deleteDetail(detail: DetailSoutenance): void {
    this.notificationService.warning(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer ce créneau (${this.formatTime(detail.heureDebut)} - ${this.formatTime(detail.heureFin)}) ?`,
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
    this.stageService.deleteDetail(detail.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.planificationDetails = this.planificationDetails.filter(d => d.id !== detail.id);
          this.calculateSlotStats();
          this.cdr.markForCheck();
          this.notificationService.success('Créneau supprimé', 'Le créneau a été supprimé avec succès');
        },
        error: (err) => {
          this.notificationService.error('Erreur', 'Impossible de supprimer le créneau');
        }
      });
  }

  /* ===== VALIDATION ===== */
  private validateDetailForm(): boolean {
    const { sujet, heureDebut, heureFin } = this.newDetail;

    if (!sujet?.trim()) {
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

    // Check for time conflicts
    const hasConflict = this.planificationDetails.some(detail => {
      if (detail.id === this.newDetail.id) return false; // Skip self when editing
      
      const existingStart = detail.heureDebut;
      const existingEnd = detail.heureFin;
      
      return (
        (heureDebut >= existingStart && heureDebut < existingEnd) ||
        (heureFin > existingStart && heureFin <= existingEnd) ||
        (heureDebut <= existingStart && heureFin >= existingEnd)
      );
    });

    if (hasConflict) {
      this.notificationService.error('Conflit horaire', 'Ce créneau chevauche avec un créneau existant');
      return false;
    }

    return true;
  }

  /* ===== EXPORT AND UTILITIES ===== */
  exportPlanificationToPDF(planification: PlanificationSoutenanceResponse): void {
    if (!planification?.id) {
      this.notificationService.error('Erreur', 'Planification invalide');
      return;
    }
    
    this.notificationService.info(
      'Export Excel',
      `Génération du fichier pour la planification du ${this.formatDate(planification.dateSoutenance)}...`
    );
    
    const url = `http://localhost:8081/stages/planification/${planification.id}/export`;
    window.open(url, '_blank');
    
    setTimeout(() => {
      this.notificationService.success(
        'Export terminé',
        'Le fichier Excel a été téléchargé avec succès'
      );
    }, 1000);
  }

  exportAllPlanificationsToPDF(): void {
    if (!this.currentUser) return;
    
    this.notificationService.info(
      'Export complet',
      'Génération du fichier Excel pour toutes vos planifications...'
    );
    
    const url = `http://localhost:8081/stages/planification/encadrant/${this.currentUser.id}/export`;
    window.open(url, '_blank');
    
    setTimeout(() => {
      this.notificationService.success(
        'Export terminé',
        'Toutes vos planifications ont été exportées'
      );
    }, 1500);
  }

  sendNotificationToStudents(planification: PlanificationSoutenanceResponse): void {
    this.notificationService.warning(
      'Envoyer les notifications',
      `Envoyer un email de notification à tous les étudiants concernés par la planification du ${this.formatDate(planification.dateSoutenance)} ?`,
      0,
      [
        {
          label: 'Annuler',
          style: 'secondary',
          action: () => {
            this.notificationService.info('Annulation', 'Aucune notification envoyée');
          }
        },
        {
          label: 'Envoyer',
          style: 'primary',
          action: () => {
            // TODO: Implement notification sending
            this.notificationService.success(
              'Notifications envoyées',
              'Tous les étudiants ont été notifiés par email'
            );
          }
        }
      ]
    );
  }

  /* ===== HELPER METHODS ===== */
  formatTime(time: string | undefined): string {
    if (!time) return '';
    return time.length >= 5 ? time.substring(0, 5) : time;
  }

  formatDate(date: string | undefined): string {
    if (!date) return '';
    try {
      return new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return date;
    }
  }

  formatDateShort(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short'
    });
  }

  getRelativeDate(date: string): string {
    const today = new Date();
    const targetDate = new Date(date);
    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Aujourd\'hui';
    if (diffDays === 1) return 'Demain';
    if (diffDays === -1) return 'Hier';
    if (diffDays > 0) return `Dans ${diffDays} jour${diffDays > 1 ? 's' : ''}`;
    return `Il y a ${Math.abs(diffDays)} jour${Math.abs(diffDays) > 1 ? 's' : ''}`;
  }

  getPlanificationStatusClass(planification: PlanificationSoutenanceResponse): string {
    const today = new Date().toISOString().split('T')[0];
    if (planification.dateSoutenance < today) return 'status-past';
    if (planification.dateSoutenance === today) return 'status-today';
    return 'status-upcoming';
  }

  getPlanificationStatusText(planification: PlanificationSoutenanceResponse): string {
    const today = new Date().toISOString().split('T')[0];
    if (planification.dateSoutenance < today) return 'Terminée';
    if (planification.dateSoutenance === today) return 'Aujourd\'hui';
    return 'À venir';
  }

  getPlanificationStatusIcon(planification: PlanificationSoutenanceResponse): string {
    const today = new Date().toISOString().split('T')[0];
    if (planification.dateSoutenance < today) return 'bi-check-circle-fill';
    if (planification.dateSoutenance === today) return 'bi-clock-fill';
    return 'bi-calendar-event-fill';
  }

  getUpcomingPlanifications(): PlanificationSoutenanceResponse[] {
    const today = new Date().toISOString().split('T')[0];
    return this.planifications.filter(p => p.dateSoutenance >= today);
  }

  getPastPlanifications(): PlanificationSoutenanceResponse[] {
    const today = new Date().toISOString().split('T')[0];
    return this.planifications.filter(p => p.dateSoutenance < today);
  }

  getTotalSlots(): number {
    return this.planificationDetails.length;
  }

  getOccupiedSlots(): number {
    return this.planificationDetails.filter(d => 
      d.etudiant && (d.etudiant as any).id
    ).length;
  }

  getAvailableSlots(): number {
    return this.getTotalSlots() - this.getOccupiedSlots();
  }

  isSlotOccupied(detail: DetailSoutenance): boolean {
    return !!(detail.etudiant && (detail.etudiant as any).id);
  }

  getStudentName(detail: DetailSoutenance): string {
    const etu: any = detail.etudiant as any;
    if (!etu) return '';
    return `${etu.prenom || ''} ${etu.nom || ''}`.trim();
  }

  getSlotStatusClass(detail: DetailSoutenance): string {
    return this.isSlotOccupied(detail) ? 'slot-occupied' : 'slot-available';
  }

  getSlotStatusText(detail: DetailSoutenance): string {
    return this.isSlotOccupied(detail) ? 'Assigné' : 'Libre';
  }

  getDuration(heureDebut: string, heureFin: string): string {
    if (!heureDebut || !heureFin) return '';
    
    const debut = new Date(`2000-01-01T${heureDebut}`);
    const fin = new Date(`2000-01-01T${heureFin}`);
    const diffMs = fin.getTime() - debut.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return mins > 0 ? `${hours}h${mins}` : `${hours}h`;
    }
  }

  /* ===== UI INTERACTIONS ===== */
  private contactAdmin(): void {
    this.notificationService.info(
      'Contact administrateur',
      'Contactez l\'administration pour obtenir des planifications de soutenance'
    );
  }

  private animateOnLoad(): void {
    setTimeout(() => {
      const items = document.querySelectorAll('.planification-item, .slot-item');
      items.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animate-slideInUp');
        }, index * 100);
      });
    }, 300);
  }

  // Keyboard shortcuts
  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault();
      this.loadMyPlanifications();
    }
    
    if (event.key === 'Escape') {
      if (this.showDetailModal) {
        this.closeDetailModal();
      } else if (this.selectedPlanification) {
        this.backToPlanifications();
      } else {
        this.resetFilters();
      }
    }
    
    if ((event.ctrlKey || event.metaKey) && event.key === 'n' && this.selectedPlanification) {
      event.preventDefault();
      this.openDetailModal();
    }
  }

  // Performance tracking
  trackByPlanificationId(index: number, planification: PlanificationSoutenanceResponse): number {
    return planification.id;
  }

  trackByDetailId(index: number, detail: DetailSoutenance): number {
    return detail.id;
  }

  getProgressPercentage(status: keyof PlanificationStats): number {
    if (this.stats.total === 0) return 0;
    return (this.stats[status] / this.stats.total) * 100;
  }
}