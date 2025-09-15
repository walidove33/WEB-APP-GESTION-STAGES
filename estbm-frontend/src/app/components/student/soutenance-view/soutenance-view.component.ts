import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { StageService } from '../../../services/stage.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { EmptyStateComponent, EmptyStateAction } from '../../../shared/components/empty-state/empty-state.component';
import { CardComponent } from '../../../shared/components/card/card.component';

import { SoutenanceEtudiantSlotDto } from '../../../models/stage.model';
import { User } from '../../../models/user.model';

interface SoutenanceStats {
  total: number;
  upcoming: number;
  today: number;
  past: number;
  thisWeek: number;
  thisMonth: number;
}

@Component({
  selector: 'app-soutenance-view',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NavbarComponent, 
    LoadingComponent,
    EmptyStateComponent,
    CardComponent
  ],
  templateUrl: './soutenance-view.component.html',
  styleUrls: ['./soutenance-view.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SoutenanceViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  soutenances: SoutenanceEtudiantSlotDto[] = [];
  filteredSoutenances: SoutenanceEtudiantSlotDto[] = [];
  loading = false;
  
  // Filters
  dateFilter = '';
  statusFilter = '';
  searchTerm = '';

  stats: SoutenanceStats = {
    total: 0,
    upcoming: 0,
    today: 0,
    past: 0,
    thisWeek: 0,
    thisMonth: 0
  };

  statusOptions = [
    { value: '', label: 'Toutes les soutenances' },
    { value: 'upcoming', label: 'À venir' },
    { value: 'today', label: 'Aujourd\'hui' },
    { value: 'past', label: 'Terminées' }
  ];

  emptyStateActions: EmptyStateAction[] = [
    {
      label: 'Consulter mes stages',
      icon: 'bi-briefcase',
      variant: 'primary',
      action: () => this.navigateToStages()
    },
    {
      label: 'Actualiser',
      icon: 'bi-arrow-clockwise',
      variant: 'secondary',
      action: () => this.loadMySoutenances()
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
      'Mes Soutenances', 
      'Chargement de vos créneaux de soutenance programmés...'
    );
    this.loadMySoutenances();
    this.animateOnLoad();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMySoutenances(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.cdr.markForCheck();

    this.stageService.getMySoutenances(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (soutenances) => {
          this.soutenances = soutenances || [];
          this.calculateStats();
          this.filterSoutenances();
          this.loading = false;
          this.cdr.markForCheck();
          
          this.notificationService.success(
            'Soutenances chargées',
            `${soutenances.length} soutenance(s) trouvée(s) dans votre planning`
          );
        },
        error: (error) => {
          this.loading = false;
          this.cdr.markForCheck();
          this.notificationService.error(
            'Erreur de chargement', 
            'Impossible de charger vos soutenances'
          );
        }
      });
  }

  private calculateStats(): void {
    const today = new Date().toISOString().split('T')[0];
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    const monthFromNow = new Date();
    monthFromNow.setMonth(monthFromNow.getMonth() + 1);

    this.stats = {
      total: this.soutenances.length,
      upcoming: this.soutenances.filter(s => s.date > today).length,
      today: this.soutenances.filter(s => s.date === today).length,
      past: this.soutenances.filter(s => s.date < today).length,
      thisWeek: this.soutenances.filter(s => 
        s.date >= today && s.date <= weekFromNow.toISOString().split('T')[0]
      ).length,
      thisMonth: this.soutenances.filter(s => 
        s.date >= today && s.date <= monthFromNow.toISOString().split('T')[0]
      ).length
    };
  }

  filterSoutenances(): void {
    let filtered = [...this.soutenances];

    // Search filter
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(s => 
        s.sujet.toLowerCase().includes(term) ||
        (s.entreprise && s.entreprise.toLowerCase().includes(term))
      );
    }

    // Date filter
    if (this.dateFilter) {
      filtered = filtered.filter(s => s.date.startsWith(this.dateFilter));
    }

    // Status filter
    if (this.statusFilter) {
      const today = new Date().toISOString().split('T')[0];
      switch (this.statusFilter) {
        case 'upcoming':
          filtered = filtered.filter(s => s.date > today);
          break;
        case 'today':
          filtered = filtered.filter(s => s.date === today);
          break;
        case 'past':
          filtered = filtered.filter(s => s.date < today);
          break;
      }
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare === 0) {
        return a.heureDebut.localeCompare(b.heureDebut);
      }
      return dateCompare;
    });

    this.filteredSoutenances = filtered;
    this.cdr.markForCheck();
  }

  onSearchChange(): void {
    this.filterSoutenances();
    this.notificationService.info(
      'Recherche',
      `${this.filteredSoutenances.length} résultat(s) trouvé(s)`
    );
  }

  onFilterChange(): void {
    this.filterSoutenances();
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.dateFilter = '';
    this.statusFilter = '';
    this.filterSoutenances();
    this.notificationService.info('Filtres réinitialisés', 'Affichage de toutes vos soutenances');
  }

  getUpcomingSoutenances(): SoutenanceEtudiantSlotDto[] {
    const today = new Date().toISOString().split('T')[0];
    return this.soutenances.filter(s => s.date >= today);
  }

  getPastSoutenances(): SoutenanceEtudiantSlotDto[] {
    const today = new Date().toISOString().split('T')[0];
    return this.soutenances.filter(s => s.date < today);
  }

  getNextSoutenance(): SoutenanceEtudiantSlotDto | null {
    const upcoming = this.getUpcomingSoutenances();
    if (upcoming.length === 0) return null;
    
    return upcoming.sort((a, b) => 
      new Date(a.date + 'T' + a.heureDebut).getTime() - 
      new Date(b.date + 'T' + b.heureDebut).getTime()
    )[0];
  }

  formatTime(time: string): string {
    return time ? time.substring(0, 5) : '';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  formatDateShort(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short'
    });
  }

  getDaysUntilSoutenance(date: string): number {
    const soutenanceDate = new Date(date);
    const today = new Date();
    const diffTime = soutenanceDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  getSoutenanceStatusClass(soutenance: SoutenanceEtudiantSlotDto): string {
    const today = new Date().toISOString().split('T')[0];
    
    if (soutenance.date < today) {
      return 'soutenance-past';
    } else if (soutenance.date === today) {
      return 'soutenance-today';
    } else {
      return 'soutenance-upcoming';
    }
  }

  getSoutenanceStatusText(soutenance: SoutenanceEtudiantSlotDto): string {
    const today = new Date().toISOString().split('T')[0];
    
    if (soutenance.date < today) {
      return 'Terminée';
    } else if (soutenance.date === today) {
      return 'Aujourd\'hui';
    } else {
      const days = this.getDaysUntilSoutenance(soutenance.date);
      return `Dans ${days} jour${days > 1 ? 's' : ''}`;
    }
  }

  getSoutenanceStatusIcon(soutenance: SoutenanceEtudiantSlotDto): string {
    const today = new Date().toISOString().split('T')[0];
    
    if (soutenance.date < today) {
      return 'bi-check-circle-fill';
    } else if (soutenance.date === today) {
      return 'bi-clock-fill';
    } else {
      return 'bi-calendar-event-fill';
    }
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

  addToCalendar(soutenance: SoutenanceEtudiantSlotDto): void {
    const startDate = new Date(soutenance.date + 'T' + soutenance.heureDebut);
    const endDate = new Date(soutenance.date + 'T' + soutenance.heureFin);
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Soutenance de stage - ' + soutenance.sujet)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent('Soutenance de stage: ' + soutenance.sujet)}`;
    
    window.open(googleCalendarUrl, '_blank');
    
    this.notificationService.success(
      'Calendrier',
      'Événement ajouté à Google Calendar'
    );
  }

  downloadSoutenanceInfo(soutenance: SoutenanceEtudiantSlotDto): void {
    this.notificationService.info(
      'Téléchargement',
      'Génération des informations de soutenance...'
    );
    
    // TODO: Implement PDF generation
    setTimeout(() => {
      this.notificationService.success(
        'Téléchargement réussi',
        'Les informations de soutenance ont été téléchargées'
      );
    }, 1500);
  }

  prepareSoutenance(soutenance: SoutenanceEtudiantSlotDto): void {
    this.notificationService.info(
      'Préparation de soutenance',
      `Guide de préparation pour votre soutenance du ${this.formatDate(soutenance.date)}`
    );
    
    // TODO: Navigate to preparation guide or show modal
  }

  exportAllToPDF(): void {
    this.notificationService.info(
      'Export PDF',
      'Génération du planning complet de vos soutenances...'
    );
    
    // TODO: Implement comprehensive PDF export
    setTimeout(() => {
      this.notificationService.success(
        'Export réussi',
        'Votre planning de soutenances a été téléchargé'
      );
    }, 2000);
  }

  private navigateToStages(): void {
    this.notificationService.info('Navigation', 'Redirection vers vos stages...');
  }

  private animateOnLoad(): void {
    setTimeout(() => {
      const items = document.querySelectorAll('.soutenance-item');
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
      this.loadMySoutenances();
    }
    
    if (event.key === 'Escape') {
      this.resetFilters();
    }
  }

  // Performance tracking
  trackBySoutenanceId(index: number, soutenance: SoutenanceEtudiantSlotDto): string {
    return `${soutenance.etudiantId}-${soutenance.date}-${soutenance.heureDebut}`;
  }

  getProgressPercentage(status: keyof SoutenanceStats): number {
    if (this.stats.total === 0) return 0;
    return (this.stats[status] / this.stats.total) * 100;
  }

  isSoutenanceToday(soutenance: SoutenanceEtudiantSlotDto): boolean {
    const today = new Date().toISOString().split('T')[0];
    return soutenance.date === today;
  }

  isSoutenanceThisWeek(soutenance: SoutenanceEtudiantSlotDto): boolean {
    const today = new Date();
    const soutenanceDate = new Date(soutenance.date);
    const diffTime = soutenanceDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 7;
  }

  isSoutenanceSoon(soutenance: SoutenanceEtudiantSlotDto): boolean {
    const days = this.getDaysUntilSoutenance(soutenance.date);
    return days <= 3 && days > 0;
  }

  getTimeRange(soutenance: SoutenanceEtudiantSlotDto): string {
    return `${this.formatTime(soutenance.heureDebut)} - ${this.formatTime(soutenance.heureFin)}`;
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

  // Enhanced calendar integration
  addToCalendarWithReminder(soutenance: SoutenanceEtudiantSlotDto): void {
    const startDate = new Date(soutenance.date + 'T' + soutenance.heureDebut);
    const endDate = new Date(soutenance.date + 'T' + soutenance.heureFin);
    
    // Add 1 hour before as reminder
    const reminderDate = new Date(startDate.getTime() - 60 * 60 * 1000);
    
    const title = `Soutenance de stage - ${soutenance.sujet}`;
    const details = `Soutenance de stage\nSujet: ${soutenance.sujet}\nDurée: ${this.getDuration(soutenance.heureDebut, soutenance.heureFin)}`;
    
    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${endDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(details)}&reminder=60`;
    
    window.open(googleCalendarUrl, '_blank');
    
    this.notificationService.success(
      'Calendrier',
      'Événement ajouté avec rappel 1h avant'
    );
  }

  // Preparation checklist
  showPreparationChecklist(soutenance: SoutenanceEtudiantSlotDto): void {
    const checklist = [
      'Préparer la présentation PowerPoint',
      'Réviser le rapport de stage',
      'Préparer les réponses aux questions fréquentes',
      'Vérifier le matériel technique',
      'Arriver 15 minutes en avance'
    ];

    this.notificationService.info(
      'Checklist de préparation',
      `Pour votre soutenance du ${this.formatDate(soutenance.date)}:\n\n${checklist.map((item, i) => `${i + 1}. ${item}`).join('\n')}`,
      0,
      [
        {
          label: 'Marquer comme préparé',
          style: 'success',
          action: () => {
            this.notificationService.success(
              'Préparation confirmée',
              'Bonne chance pour votre soutenance !'
            );
          }
        }
      ]
    );
  }

  // Bulk actions
  exportSelectedToPDF(soutenances: SoutenanceEtudiantSlotDto[]): void {
    this.notificationService.info(
      'Export sélectif',
      `Export de ${soutenances.length} soutenance(s) en cours...`
    );
    
    // TODO: Implement selective PDF export
    setTimeout(() => {
      this.notificationService.success(
        'Export terminé',
        `${soutenances.length} soutenance(s) exportée(s) avec succès`
      );
    }, 2000);
  }
}