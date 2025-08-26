


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { StageService } from '../../../services/stage.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { StageRequest } from '../../../models/stage.model';

@Component({
  selector: 'app-demande-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './demande-form.component.html',
  styleUrls: ['./demande-form.component.scss']
})
export class DemandeFormComponent implements OnInit {
  stageData: StageRequest = {
    sujet: '',
    entreprise: '',
    adresseEntreprise: '',
    telephoneEntreprise: '',
    representantEntreprise: '',
    filiere: '',
    dateDebut: '',
    dateFin: ''
  };

  loading = false;
  
  filieres = [
    'INFORMATIQUE',
    'GENIE_CIVIL',
    'ELECTROMECANIQUE',
    'GENIE_ELECTRIQUE',
    'GENIE_INDUSTRIEL',
    'GENIE_CHIMIQUE',
    'GENIE_MECANIQUE',
    'GENIE_ENERGETIQUE'
  ];

  constructor(
    private stageService: StageService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    // Check authentication
    if (!this.authService.isAuthenticated()) {
      this.toastService.error('Vous devez être connecté pour accéder à cette page');
      this.router.navigate(['/login']);
      return;
    }

    // Check if user is a student
    const role = this.authService.getUserRole();
    if (role !== 'ETUDIANT') {
      this.toastService.error('Seuls les étudiants peuvent créer des demandes de stage');
      this.router.navigate(['/login']);
      return;
    }

    // console.log('✅ User authenticated and authorized to create stage request');
    
    // Animation
    setTimeout(() => {
      this.animateForm();
    }, 100);
  }

  onSubmit(): void {
    if (this.loading) return;

    // console.log('📝 Submitting stage request:', this.stageData);
    this.loading = true;

    this.stageService.createDemande(this.stageData).subscribe({
      next: (stage) => {
        // console.log('✅ Stage request created successfully:', stage);
        this.toastService.success('Demande de stage créée avec succès');
        this.router.navigate(['/student/stages']);
      },
      error: (error) => {
        // console.error('❌ Error creating stage request:', error);
        this.toastService.error(error.message || 'Erreur lors de la création de la demande');
        this.loading = false;
      }
    });
  }

  getMinDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  private animateForm(): void {
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
      setTimeout(() => {
        group.classList.add('animate-slideInFromBottom');
      }, index * 100);
    });
  }
}