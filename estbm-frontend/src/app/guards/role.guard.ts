import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../services/notification.service';

@Injectable({ 
  providedIn: 'root' 
})
export class RoleGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    // Check if user is authenticated
    if (!this.authService.isAuthenticated()) {
      this.notificationService.warning(
        'Accès refusé',
        'Vous devez être connecté pour accéder à cette page'
      );
      this.router.navigate(['/login'], { 
        queryParams: { returnUrl: state.url } 
      });
      return false;
    }

    const userRole = this.authService.getUserRole();
    const requiredRoles = route.data['roles'] as string[];
    const requiredRole = route.data['role'] as string;

    // Check single role requirement
    if (requiredRole && userRole !== requiredRole) {
      this.handleUnauthorizedAccess(userRole, requiredRole);
      return false;
    }

    // Check multiple roles requirement
    if (requiredRoles && !requiredRoles.includes(userRole || '')) {
      this.handleUnauthorizedAccess(userRole, requiredRoles.join(', '));
      return false;
    }

    // Role-specific route validation
    const url = state.url;
    
    if (url.includes('/planifications') && userRole !== 'ENCADRANT') {
      this.handleUnauthorizedAccess(userRole, 'ENCADRANT');
      return false;
    }

    if (url.includes('/ma-planification') && userRole !== 'ETUDIANT') {
      this.handleUnauthorizedAccess(userRole, 'ETUDIANT');
      return false;
    }

    if (url.includes('/admin') && userRole !== 'ADMIN') {
      this.handleUnauthorizedAccess(userRole, 'ADMIN');
      return false;
    }

    return true;
  }

  private handleUnauthorizedAccess(userRole: string | null, requiredRole: string): void {
    this.notificationService.error(
      'Accès non autorisé',
      `Votre rôle (${userRole || 'Non défini'}) ne permet pas d'accéder à cette section. Rôle requis: ${requiredRole}`
    );

    // Redirect to appropriate dashboard based on user role
    switch (userRole) {
      case 'ADMIN':
        this.router.navigate(['/admin/dashboard']);
        break;
      case 'ENCADRANT':
        this.router.navigate(['/encadrant/dashboard']);
        break;
      case 'ETUDIANT':
        this.router.navigate(['/student/dashboard']);
        break;
      default:
        this.router.navigate(['/login']);
        break;
    }
  }
}