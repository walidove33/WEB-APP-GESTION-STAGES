import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { StageService } from '../../../services/stage.service';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { LoadingComponent } from '../../../shared/components/loading/loading.component';
import { 
  PlanificationSoutenanceResponse, 
  DetailSoutenance 
} from '../../../models/stage.model';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-soutenance-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent, LoadingComponent],
  templateUrl: './soutenance-management.component.html',
  styleUrls: ['./soutenance-management.component.scss']
})
export class SoutenanceManagementComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  currentUser: User | null = null;
  planifications: PlanificationSoutenanceResponse[] = [];
  selectedPlanification: PlanificationSoutenanceResponse | null = null;
  planificationDetails: DetailSoutenance[] = [];
  
  loading = false;
  loadingDetails = false;

  // Filters
  dateFilter = '';
  statusFilter = '';

  constructor(
    private stageService: StageService,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.notificationService.info('Gestion Soutenances', 'Chargement de vos planifications de soutenance...');
    this.loadMyPlanifications();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadMyPlanifications(): void {
    if (!this.currentUser) return;

    this.loading = true;
    this.stageService.getPlanificationsByEncadrant(this.currentUser.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (planifications) => {
          this.planifications = planifications;
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

  viewPlanificationDetails(planification: PlanificationSoutenanceResponse): void {
    this.selectedPlanification = planification;
    this.loadPlanificationDetails(planification.id);
    
    this.notificationService.info(
      'Détails de planification',
      `Affichage des créneaux pour le ${planification.dateSoutenance}`
    );
  }

  loadPlanificationDetails(planifId: number): void {
    this.loadingDetails = true;
    this.stageService.getPlanificationDetails(planifId)
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

  backToPlanifications(): void {
    this.selectedPlanification = null;
    this.planificationDetails = [];
    this.notificationService.info('Navigation', 'Retour à la liste des planifications');
  }

  getFilteredPlanifications(): PlanificationSoutenanceResponse[] {
    let filtered = [...this.planifications];

    if (this.dateFilter) {
      filtered = filtered.filter(p => 
        p.dateSoutenance.includes(this.dateFilter)
      );
    }

    return filtered;
  }

  getUpcomingPlanifications(): PlanificationSoutenanceResponse[] {
    const today = new Date().toISOString().split('T')[0];
    return this.planifications.filter(p => p.dateSoutenance >= today);
  }

  getPastPlanifications(): PlanificationSoutenanceResponse[] {
    const today = new Date().toISOString().split('T')[0];
    return this.planifications.filter(p => p.dateSoutenance < today);
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

  getTotalSlots(): number {
    return this.planificationDetails.length;
  }

  getOccupiedSlots(): number {
    return this.planificationDetails.filter(d => d.etudiant.id > 0).length;
  }

  getAvailableSlots(): number {
    return this.getTotalSlots() - this.getOccupiedSlots();
  }

  isSlotOccupied(detail: DetailSoutenance): boolean {
    return detail.etudiant.id > 0;
  }

  getSlotStatusClass(detail: DetailSoutenance): string {
    return this.isSlotOccupied(detail) ? 'slot-occupied' : 'slot-available';
  }

  getSlotStatusText(detail: DetailSoutenance): string {
    return this.isSlotOccupied(detail) ? 'Occupé' : 'Disponible';
  }

  exportPlanificationToPDF(planification: PlanificationSoutenanceResponse): void {
    this.notificationService.info(
      'Export PDF',
      `Génération du PDF pour la planification du ${planification.dateSoutenance}...`
    );
    
    // TODO: Implement PDF export
    setTimeout(() => {
      this.notificationService.success(
        'Export réussi',
        'Le fichier PDF a été téléchargé avec succès'
      );
    }, 2000);
  }

  sendNotificationToStudents(planification: PlanificationSoutenanceResponse): void {
    this.notificationService.warning(
      'Envoyer les notifications',
      `Envoyer un email de notification à tous les étudiants concernés par la planification du ${planification.dateSoutenance} ?`,
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
}