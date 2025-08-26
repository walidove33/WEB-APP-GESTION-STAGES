


import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { NotificationService } from '../../../services/notification.service';
import { NotificationComponent } from '../../../shared/components/notification/notification.component';
import { NavbarComponent } from '../../../shared/components/navbar/navbar.component';
import { User, CreateAdminRequest } from '../../../models/user.model';

@Component({
  selector: 'app-admin-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, NavbarComponent],
  templateUrl: './admin-management.component.html',
  styleUrls: ['./admin-management.component.scss']
})
export class AdminManagementComponent implements OnInit {
  admins: User[] = [];
  newAdmin: CreateAdminRequest = {
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    password: ''
  };

  successMessage = '';
  errorMessage = '';
  loading = false;
  loadingList = false;

  constructor(
    private userService: UserService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.notificationService.info('Gestion Administrateurs', 'Chargement de la page de gestion...');
    this.loadAdmins();
    
    // Animation cascade
    setTimeout(() => {
      this.animateElements();
    }, 100);
  }

  loadAdmins(): void {
    this.loadingList = true;
    this.notificationService.info('Chargement', 'Récupération de la liste des administrateurs...');
    
    this.userService.getAdmins().subscribe({
      next: (admins: User[]) => {
        this.admins = admins;
        this.loadingList = false;
        this.notificationService.success('Administrateurs', `${admins.length} administrateurs chargés avec succès`);
      },
      error: (error: any) => {
        this.loadingList = false;
        this.notificationService.error('Erreur de chargement', 'Impossible de charger les administrateurs');
        // console.error('Erreur chargement admins:', error);
      }
    });
  }

  createAdmin(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.notificationService.info('Création', 'Création du compte administrateur en cours...');

    this.userService.createAdmin(this.newAdmin).subscribe({
      next: (admin: any) => {
        this.loading = false;
        const nom = admin.nom ?? '';
        const prenom = admin.prenom ?? '';
        this.notificationService.success('Administrateur créé', `Le compte de ${prenom} ${nom} a été créé avec succès !`);
        this.resetForm();
        this.loadAdmins();
      },
      error: (error: any) => {
        this.loading = false;
        const errorMsg = error.error?.message || 'Erreur lors de la création de l\'administrateur';
        this.notificationService.error('Erreur de création', errorMsg);
        // console.error('Erreur création admin:', error);
      }
    });
  }

  editAdmin(admin: User): void {
    this.notificationService.info('Modification', `Ouverture de l'édition pour ${admin.nom} ${admin.prenom} (fonctionnalité à implémenter)`);
  }

  deleteAdmin(id: number): void {
    const admin = this.admins.find(a => a.id === id);
    const adminName = admin ? `${admin.prenom} ${admin.nom}` : 'cet administrateur';
    
    this.notificationService.warning(
      'Confirmer la suppression',
      `Êtes-vous sûr de vouloir supprimer ${adminName} ?`,
      0,
      [
        {
          label: 'Annuler',
          style: 'secondary',
          action: () => {
            this.notificationService.info('Annulation', 'Suppression annulée');
          }
        },
        {
          label: 'Supprimer',
          style: 'danger',
          action: () => {
            this.notificationService.info('Suppression', `Suppression de ${adminName} en cours...`);
            
            this.userService.deleteAdmin(id).subscribe({
              next: () => {
                this.notificationService.success('Administrateur supprimé', `${adminName} a été supprimé avec succès`);
                this.loadAdmins();
              },
              error: (error: any) => {
                const errorMsg = error.error?.message || 'Erreur lors de la suppression';
                this.notificationService.error('Erreur de suppression', errorMsg);
                // console.error('Erreur suppression admin:', error);
              }
            });
          }
        }
      ]
    );
  }

  private resetForm(): void {
    this.newAdmin = { 
      nom: '', 
      prenom: '', 
      email: '', 
      telephone: '', 
      password: '' 
    };
    this.notificationService.info('Formulaire', 'Formulaire réinitialisé');
  }

  private animateElements(): void {
    const cards = document.querySelectorAll('.management-card');
    cards.forEach((card, index) => {
      setTimeout(() => {
        card.classList.add('animate-slideInFromBottom');
      }, index * 150);
    });
  }

  // Méthodes pour les notifications sur les actions du formulaire
  onFormFieldChange(fieldName: string): void {
    // Notification discrète pour les changements de champs importants
    if (fieldName === 'email' && this.newAdmin.email) {
      this.notificationService.info('Email', 'Email saisi');
    }
  }

  onFormFieldFocus(fieldName: string): void {
    // Notifications d'aide contextuelle
    const helpMessages: { [key: string]: string } = {
      'nom': 'Saisissez le nom de famille',
      'prenom': 'Saisissez le prénom',
      'email': 'Utilisez une adresse email valide (@est.ac.ma recommandé)',
      'telephone': 'Format recommandé: +212 6 XX XX XX XX',
      'password': 'Minimum 6 caractères requis'
    };

    if (helpMessages[fieldName]) {
      this.notificationService.info('Aide', helpMessages[fieldName]);
    }
  }
}