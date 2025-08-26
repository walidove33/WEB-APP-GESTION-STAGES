
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { RegisterRequest } from '../../models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  userData: RegisterRequest = {
  nom: '',
  prenom: '',
  specialite: '',        // <— ajouté
  codeApogee: '',
  codeMassar: '',
  dateNaissance: '',
  email: '',
  password: '',
  telephone: ''
};

specialites = [
  'INFORMATIQUE',
  'GENIE_CIVIL',
  'ELECTROMECANIQUE',
  /* ... */
];
  
  errorMessage = '';
  successMessage = '';
  loading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  onRegister(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    // console.log('➡️ Register payload:', this.userData);

    this.authService.register(this.userData).subscribe({
      next: (response) => {
        this.loading = false;
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.toastService.success('Compte créé avec succès !');
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
  this.loading = false;

  // 1️⃣ Log the full HttpErrorResponse
  // console.error('🔴 Register error response object:', err);

  // 2️⃣ Extract the server’s message (it may be a plain string or JSON)
  let serverMsg = 'Erreur inattendue';
  if (typeof err.error === 'string') {
    serverMsg = err.error;
  } else if (err.error && err.error.message) {
    serverMsg = err.error.message;
  } else if (err.statusText) {
    serverMsg = err.statusText;
  }

  // 3️⃣ Show it in the template and via toast
  this.errorMessage = serverMsg;
  this.toastService.error(serverMsg);
}

    });
  }
}