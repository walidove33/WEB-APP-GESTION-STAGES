import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
import { EncadrantDto } from '../../../models/user.model';

@Component({
  selector: 'app-encadrant-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './EncadrantEditComponent.html',
  styleUrls: ['./EncadrantEditComponent.scss']
})
export class EncadrantEditComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  loading = false;
  encadrantId!: number;
  editModel: Partial<EncadrantDto & { telephone?: string; email?: string }> = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.encadrantId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.encadrantId) {
      this.notificationService.error('Erreur', 'ID encadrant invalide');
      this.router.navigate(['/admin/encadrants']);
      return;
    }
    this.loadEncadrant();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadEncadrant(): void {
    this.loading = true;
    this.userService.getEncadrantById(this.encadrantId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (enc) => {
          this.loading = false;
          this.editModel = {
            nom: enc.nom || '',
            prenom: enc.prenom || '',
            email: enc.email || '',
            telephone: (enc as any).telephone || '',
            specialite: enc.specialite || ''
          };
        },
        error: (err) => {
          this.loading = false;
          this.notificationService.error('Erreur', err.message || 'Impossible de charger l\'encadrant');
          this.router.navigate(['/admin/encadrants']);
        }
      });
  }

  submit(): void {
    if (!this.editModel.nom || !this.editModel.prenom) {
      this.notificationService.error('Validation', 'Nom et prénom requis');
      return;
    }

    this.loading = true;
    // Prépare payload conforme à UpdateEncadrantRequest (si tu as ajouté email côté backend, envoie-le)
    const payload: any = {
      nom: this.editModel.nom,
      prenom: this.editModel.prenom,
      telephone: this.editModel.telephone,
      specialite: this.editModel.specialite
    };
    // si ton backend accepte email dans UpdateEncadrantRequest, ajoute: payload.email = this.editModel.email;

    this.userService.updateEncadrant(this.encadrantId, payload)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updated) => {
          this.loading = false;
          this.notificationService.success('Modifié', `${updated.prenom} ${updated.nom} mis à jour`);
          // retourne à la liste
          this.router.navigate(['/admin/encadrants']);
        },
        error: (err) => {
          this.loading = false;
          this.notificationService.error('Erreur', err.message || 'Erreur lors de la mise à jour');
        }
      });
  }

  cancel(): void {
    this.router.navigate(['/admin/encadrants']);
  }
}
