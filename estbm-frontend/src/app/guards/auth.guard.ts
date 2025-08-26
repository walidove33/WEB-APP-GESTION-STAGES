


import { Injectable } from '@angular/core';
import { 
  CanActivate, 
  ActivatedRouteSnapshot, 
  RouterStateSnapshot, 
  Router 
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot, p0: any): boolean {
    const requiredRole = route.data['role'];
    const userRole = this.authService.getUserRole();
    
    // Vérifier si l'utilisateur est authentifié
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
      return false;
    }

    // Vérifier le rôle si spécifié dans la route
    if (requiredRole && userRole !== requiredRole) {
      this.router.navigate(['/unauthorized']);
      return false;
    }
    
    return true;
  }
}