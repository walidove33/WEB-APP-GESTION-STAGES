// src/app/guards/auth.guard.spec.ts

import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { AuthGuard } from './auth.guard';
import { AuthService } from '../services/auth.service';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', [
      'isAuthenticated',
      'getUserRole'
    ]);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router,      useValue: routerSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router      = TestBed.inject(Router)      as jasmine.SpyObj<Router>;
  });

  it('devrait autoriser l’accès si authentifié et rôle OK', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.getUserRole.and.returnValue('ADMIN');
    const routeSnapshot: any = { data: { role: 'ADMIN' } };

    const can = guard.canActivate(routeSnapshot, {} as any);
    expect(can).toBeTrue();
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('devrait bloquer et rediriger si non authentifié', () => {
    authService.isAuthenticated.and.returnValue(false);

    const can = guard.canActivate({ data: {} } as any, {} as any);
    expect(can).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('devrait bloquer et rediriger si rôle non autorisé', () => {
    authService.isAuthenticated.and.returnValue(true);
    authService.getUserRole.and.returnValue('ETUDIANT');
    const routeSnapshot: any = { data: { role: 'ADMIN' } };

    const can = guard.canActivate(routeSnapshot, {} as any);
    expect(can).toBeFalse();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});
