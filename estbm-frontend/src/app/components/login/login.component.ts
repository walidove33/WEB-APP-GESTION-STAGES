

// import { Component } from "@angular/core"
// import { CommonModule } from "@angular/common"
// import { FormsModule } from "@angular/forms"
// import { Router, RouterModule } from "@angular/router"
// import { AuthService } from "../../services/auth.service"
// import { ToastService } from "../../services/toast.service"
// import { LoginRequest } from "../../models/auth.model"

// @Component({
//   selector: "app-login",
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './login.component.html',
//   styleUrls: ['./login.component.scss']
// })
// export class LoginComponent {
//   credentials: LoginRequest = {
//     email: "",
//     password: "",
//   }

//   errorMessage = ""
//   loading = false
//   showPassword = false
//   rememberMe = false

//   constructor(
//     private authService: AuthService,
//     private router: Router,
//     private toastService: ToastService
//   ) {}

//   togglePassword(): void {
//     this.showPassword = !this.showPassword
//   }

//   onLogin(): void {
//     this.loading = true
//     this.errorMessage = ""

//     this.authService.login(this.credentials).subscribe({
//       next: (response) => {
//         this.loading = false
//         this.toastService.success(`Bienvenue ${response.user.prenom} !`)
        
//         const role = response.role
//         switch (role) {
//           case "ADMIN":
//             this.router.navigate(["/admin/dashboard"])
//             break
//           case "ENCADRANT":
//             this.router.navigate(["/encadrant/dashboard"])
//             break
//           case "ETUDIANT":
//           default:
//             this.router.navigate(["/student/dashboard"])
//             break
//         }
//       },
//       error: (error) => {
//         this.loading = false
//         console.error("Erreur de connexion:", error)

//         if (error.status === 401) {
//           this.errorMessage = "Email ou mot de passe incorrect"
//         } else if (error.status === 403) {
//           this.errorMessage = "Accès refusé. Contactez l'administrateur."
//         } else if (error.status === 0) {
//           this.errorMessage = "Impossible de se connecter au serveur"
//         } else {
//           this.errorMessage = "Une erreur est survenue. Veuillez réessayer."
//         }
        
//         this.toastService.error(this.errorMessage)
//       },
//     })
//   }
// }


import { Component, OnInit, OnDestroy } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormsModule } from "@angular/forms"
import { Router, RouterModule } from "@angular/router"
import { Subject, takeUntil } from "rxjs"
import { AuthService } from "../../services/auth.service"
import { NotificationService } from "../../services/notification.service"
import { LoginRequest } from "../../models/auth.model"

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>()

  credentials: LoginRequest = {
    email: "",
    password: "",
  }

  errorMessage = ""
  loading = false
  showPassword = false
  rememberMe = false
  
  // Animation states
  formAnimated = false
  submitAttempted = false

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    // Check if already authenticated
    if (this.authService.isAuthenticated()) {
      this.notificationService.info('Déjà connecté', 'Redirection vers votre tableau de bord...')
      this.redirectToDashboard()
      return
    }

    // Subscribe to loading state
    this.authService.loginLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.loading = loading
      })

    // Animate form on load
    setTimeout(() => {
      this.formAnimated = true
      this.animateFormElements()
    }, 100)

    // Welcome message
    this.notificationService.info(
      'Bienvenue sur EST Stages',
      'Connectez-vous pour accéder à votre espace personnel'
    )
  }

  ngOnDestroy(): void {
    this.destroy$.next()
    this.destroy$.complete()
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword
    
    // Add micro-animation
    const passwordInput = document.getElementById('password') as HTMLInputElement
    if (passwordInput) {
      passwordInput.classList.add('animate-pulse')
      setTimeout(() => {
        passwordInput.classList.remove('animate-pulse')
      }, 200)
    }
  }

  onLogin(): void {
    this.submitAttempted = true
    this.errorMessage = ""

    // Validate form
    if (!this.credentials.email || !this.credentials.password) {
      this.errorMessage = "Veuillez remplir tous les champs"
      this.notificationService.errorWithShake('Champs requis', this.errorMessage)
      this.animateFormError()
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(this.credentials.email)) {
      this.errorMessage = "Format d'email invalide"
      this.notificationService.errorWithShake('Email invalide', this.errorMessage)
      this.animateFormError()
      return
    }

    // Start login process with animation
    this.animateSubmitButton()

    this.authService.login(this.credentials)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          // Success animation
          this.animateSuccess()
          
          // Store remember me preference
          if (this.rememberMe) {
            localStorage.setItem('rememberMe', 'true')
          }
          
          // Redirect with delay for animation
          setTimeout(() => {
            this.redirectToDashboard(response.role)
          }, 1000)
        },
        error: (error) => {
          // console.error("Erreur de connexion:", error)
          
          // Error animation
          this.animateFormError()
          
          // Set error message
          if (error.status === 401) {
            this.errorMessage = "Email ou mot de passe incorrect"
          } else if (error.status === 403) {
            this.errorMessage = "Accès refusé. Contactez l'administrateur."
          } else if (error.status === 0) {
            this.errorMessage = "Impossible de se connecter au serveur"
          } else {
            this.errorMessage = "Une erreur est survenue. Veuillez réessayer."
          }
        },
      })
  }

  private redirectToDashboard(role?: string): void {
    const userRole = role || this.authService.getUserRole()
    
    switch (userRole) {
      case "ADMIN":
        this.router.navigate(["/admin/dashboard"])
        break
      case "ENCADRANT":
        this.router.navigate(["/encadrant/dashboard"])
        break
      case "ETUDIANT":
      default:
        this.router.navigate(["/student/dashboard"])
        break
    }
  }

  private animateFormElements(): void {
    const formGroups = document.querySelectorAll('.form-group')
    formGroups.forEach((group, index) => {
      setTimeout(() => {
        group.classList.add('animate-slideInUp')
      }, index * 100)
    })
  }

  private animateSubmitButton(): void {
    const submitBtn = document.querySelector('.btn-login')
    if (submitBtn) {
      submitBtn.classList.add('processing-animation')
    }
  }

  private animateSuccess(): void {
    const loginCard = document.querySelector('.login-card')
    const submitBtn = document.querySelector('.btn-login')
    
    if (loginCard) {
      loginCard.classList.add('success-animation')
    }
    
    if (submitBtn) {
      submitBtn.classList.remove('processing-animation')
      submitBtn.classList.add('success-animation')
    }

    // Add success visual feedback
    this.createSuccessParticles()
  }

  private animateFormError(): void {
    const loginCard = document.querySelector('.login-card')
    const submitBtn = document.querySelector('.btn-login')
    
    if (loginCard) {
      loginCard.classList.add('error-animation')
      setTimeout(() => {
        loginCard.classList.remove('error-animation')
      }, 500)
    }
    
    if (submitBtn) {
      submitBtn.classList.remove('processing-animation')
    }

    // Shake invalid fields
    const invalidFields = document.querySelectorAll('.form-control')
    invalidFields.forEach(field => {
      field.classList.add('animate-shake')
      setTimeout(() => {
        field.classList.remove('animate-shake')
      }, 500)
    })
  }

  private createSuccessParticles(): void {
    // Create floating success particles
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        const particle = document.createElement('div')
        particle.innerHTML = '✨'
        particle.style.position = 'fixed'
        particle.style.fontSize = '20px'
        particle.style.pointerEvents = 'none'
        particle.style.zIndex = '9999'
        particle.style.left = Math.random() * window.innerWidth + 'px'
        particle.style.top = Math.random() * window.innerHeight + 'px'
        particle.style.animation = 'float-up 2s ease-out forwards'
        
        document.body.appendChild(particle)
        
        setTimeout(() => {
          document.body.removeChild(particle)
        }, 2000)
      }, i * 100)
    }
  }

  // Form field event handlers with micro-animations
  onEmailFocus(): void {
    this.notificationService.info('Email', 'Saisissez votre adresse email institutionnelle')
  }

  onPasswordFocus(): void {
    this.notificationService.info('Mot de passe', 'Saisissez votre mot de passe sécurisé')
  }

  onEmailBlur(): void {
    if (this.credentials.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (emailRegex.test(this.credentials.email)) {
        this.notificationService.success('Email valide', 'Format d\'email correct')
      } else {
        this.notificationService.error('Email invalide', 'Vérifiez le format de votre email')
      }
    }
  }

  onFormSubmit(event: Event): void {
    event.preventDefault()
    this.onLogin()
  }

  // Keyboard shortcuts
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !this.loading) {
      this.onLogin()
    }
    
    if (event.key === 'Escape') {
      this.credentials = { email: "", password: "" }
      this.errorMessage = ""
      this.notificationService.info('Formulaire réinitialisé', 'Champs vidés')
    }
  }

  // Auto-fill detection
  onInputChange(field: 'email' | 'password'): void {
    // Detect auto-fill and animate
    setTimeout(() => {
      const input = document.getElementById(field) as HTMLInputElement
      if (input && input.value && !input.matches(':focus')) {
        input.classList.add('auto-filled')
        this.notificationService.info('Auto-remplissage détecté', `${field} complété automatiquement`)
      }
    }, 100)
  }

  // Demo credentials (remove in production)
  fillDemoCredentials(role: 'student' | 'encadrant' | 'admin'): void {
    const demoCredentials = {
      student: { email: 'etudiant@est.ac.ma', password: 'password123' },
      encadrant: { email: 'encadrant@est.ac.ma', password: 'password123' },
      admin: { email: 'admin@est.ac.ma', password: 'password123' }
    }

    this.credentials = demoCredentials[role]
    this.notificationService.info('Démo', `Identifiants ${role} pré-remplis`)
    
    // Animate the filled fields
    setTimeout(() => {
      const inputs = document.querySelectorAll('.form-control')
      inputs.forEach(input => {
        input.classList.add('animate-pulse')
        setTimeout(() => {
          input.classList.remove('animate-pulse')
        }, 300)
      })
    }, 100)
  }
}