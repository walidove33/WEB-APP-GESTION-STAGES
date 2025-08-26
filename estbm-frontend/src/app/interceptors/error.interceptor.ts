


import { inject } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastService } from '../services/toast.service';

export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<any>, 
  next: HttpHandlerFn
): Observable<HttpEvent<any>> => {
  const router = inject(Router);
  const toastService = inject(ToastService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.error('🚨 HTTP Error:', error);
      
      if (error.status === 401) {
        console.log('🔒 401 Unauthorized - Clearing token and redirecting to login');
        localStorage.clear();
        router.navigate(['/login']);
        toastService.error('Session expirée. Veuillez vous reconnecter.');
      } else if (error.status === 403) {
        toastService.error('Accès refusé. Vous n\'avez pas les permissions nécessaires.');
      } else if (error.status === 0) {
        toastService.error('Impossible de se connecter au serveur. Vérifiez votre connexion.');
      }
      
      return throwError(() => error);
    })
  );
};