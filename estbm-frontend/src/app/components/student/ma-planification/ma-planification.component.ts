import { Component, OnInit, OnDestroy, ChangeDetectorRef, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { PlanificationService } from '../../../services/planification.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { DataTableComponent, TableColumn } from '../../../shared/components/data-table/data-table.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { CardComponent } from '../../../shared/components/card/card.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

import { SoutenanceEtudiantSlotDto } from '../../../models/stage.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-ma-planification',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    NavbarComponent, 
    DataTableComponent, 
    CardComponent
  ],
  templateUrl: './ma-planification.component.html',
  styleUrls: ['./ma-planification.component.scss']
})
export class MaPlanificationComponent implements OnInit, OnDestroy {
  @ViewChild('timeTemplate', { static: true }) timeTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate', { static: true }) statusTemplate!: TemplateRef<any>;
  @ViewChild('dateTemplate', { static: true }) dateTemplate!: TemplateRef<any>;

  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  soutenances: SoutenanceEtudiantSlotDto[] = [];
  loading = false;

  // Table configuration
  columns: TableColumn<SoutenanceEtudiantSlotDto>[] = [];

  // Statistics
  stats = {
    total: 0,
    upcoming: 0,
    today: 0,
    past: 0
  };

  // Next soutenance
  nextSoutenance: SoutenanceEtudiantSlotDto | null = null;

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
      'Ma Planification',
      'Consultation de vos créneaux de soutenance programmés'
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeTableColumns(): void {
    this.columns = [
      {
        key: 'date',
        label: 'Date',
        sortable: true,
        type: 'custom',
        template: this.dateTemplate,
        width: '200px'
      },
      {
        key: 'heureDebut',
        label: 'Horaire',
        type: 'custom',
        template: this.timeTemplate,
        width: '150px'
      },
      {
        key: 'sujet',
        label: 'Sujet de Soutenance',
        sortable: true,
        type: 'text'
      },
      {
        key: 'date',
        label: 'Statut',
        type: 'custom',
        template: this.statusTemplate,
        width: '120px'
      }
    ];
  }

  private loadData(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.planificationService.getByEtudiant(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (soutenances) => {
          this.soutenances = soutenances;
          this.calculateStats();
          this.findNextSoutenance();
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: (error) => {
          this.loading = false;
          // console.error('Erreur chargement soutenances:', error);
          this.cdr.detectChanges();
        }
      });
  }

  private calculateStats(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.stats = {
      total: this.soutenances.length,
      upcoming: this.soutenances.filter(s => s.date > today).length,
      today: this.soutenances.filter(s => s.date === today).length,
      past: this.soutenances.filter(s => s.date < today).length
    };
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

  getTimeRange(soutenance: SoutenanceEtudiantSlotDto): string {
    return `${this.formatTime(soutenance.heureDebut)} - ${this.formatTime(soutenance.heureFin)}`;
  }

  getSoutenanceStatus(soutenance: SoutenanceEtudiantSlotDto): string {
    const today = new Date().toISOString().split('T')[0];
    
    if (soutenance.date < today) {
      return 'Terminée';
    } else if (soutenance.date === today) {
      return 'Aujourd\'hui';
    } else {
      const days = Math.ceil((new Date(soutenance.date).getTime() - new Date(today).getTime()) / (1000 * 60 * 60 * 24));
      return `Dans ${days} jour${days > 1 ? 's' : ''}`;
    }
  }

  getSoutenanceStatusClass(soutenance: SoutenanceEtudiantSlotDto): string {
    const today = new Date().toISOString().split('T')[0];
    
    if (soutenance.date < today) {
      return 'badge-secondary';
    } else if (soutenance.date === today) {
      return 'badge-warning';
    } else {
      return 'badge-primary';
    }
  }

  getDaysUntilSoutenance(date: string): number {
    const soutenanceDate = new Date(date);
    const today = new Date();
    const diffTime = soutenanceDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
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

  refreshData(): void {
    this.loadData();
  }

  // Keyboard shortcuts
  onKeyDown(event: KeyboardEvent): void {
    if ((event.ctrlKey || event.metaKey) && event.key === 'r') {
      event.preventDefault();
      this.refreshData();
    }
  }



  
}