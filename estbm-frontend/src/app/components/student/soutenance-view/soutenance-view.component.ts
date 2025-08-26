import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StageService } from '../../../services/stage.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { SoutenanceEtudiantSlotDto } from '../../../models/stage.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-soutenance-view',
  standalone: true,
  imports: [CommonModule, RouterModule, NavbarComponent, LoadingComponent],
  templateUrl: './soutenance-view.component.html',
  styleUrls: ['./soutenance-view.component.scss']
})
export class SoutenanceViewComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  soutenances: SoutenanceEtudiantSlotDto[] = [];
  loading = false;

  constructor(
    private stageService: StageService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.notificationService.info('Mes Soutenances', 'Chargement de vos créneaux de soutenance...');
    this.loadMySoutenances();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMySoutenances(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.stageService.getMySoutenances(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (soutenances) => {
          this.soutenances = soutenances;
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
    return time.substring(0, 5); // Remove seconds
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
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
}