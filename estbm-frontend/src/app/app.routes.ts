import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { RoleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'student',
    canActivate: [RoleGuard],
    data: { role: 'ETUDIANT' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/student/student-dashboard/student-dashboard.component').then(m => m.StudentDashboardComponent)
      },
      {
        path: 'ma-planification',
        loadComponent: () => import('./components/student/ma-planification/ma-planification.component').then(m => m.MaPlanificationComponent)
      },
      {
        path: 'stages',
        loadComponent: () => import('./components/student/stage-list/stage-list.component').then(m => m.StageListComponent)
      },
      {
        path: 'new-stage',
        loadComponent: () => import('./components/student/demande-form/demande-form.component').then(m => m.DemandeFormComponent)
      },
      {
       path: 'soutenances',
       loadComponent: () => import('./components/student/soutenance-view/soutenance-view.component').then(m => m.SoutenanceViewComponent)
     }
    ]
  },
  {
    path: 'encadrant',
    canActivate: [RoleGuard],
    data: { role: 'ENCADRANT' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/encadrant/encadrant-dashboard/encadrant-dashboard.component').then(m => m.EncadrantDashboardComponent)
      },
      {
        path: 'planifications',
        loadComponent: () => import('./components/encadrant/planifications/planifications.component').then(m => m.PlanificationsComponent)
      },
      {
        path: 'rapports',
        loadComponent: () => import('./components/encadrant/rapport-list/rapport-list.component').then(m => m.RapportListComponent)
      },
     {
      path: 'commentaires',
      loadComponent: () => import('./components/encadrant/rapport-commentaires/rapport-commentaires.component')
                        .then(m => m.RapportCommentairesComponent)
     },
     {
       path: 'soutenances',
       loadComponent: () => import('./components/encadrant/soutenance-management/soutenance-management.component').then(m => m.SoutenanceManagementComponent)
     }
    ]
  },
  {
    path: 'admin',
    canActivate: [RoleGuard],
    data: { role: 'ADMIN' },
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./components/admin/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'encadrants',
        loadComponent: () => import('./components/admin/encadrant-management/encadrant-management.component').then(m => m.EncadrantManagementComponent)
      },
      {
        path: 'admins',
        loadComponent: () => import('./components/admin/admin-management/admin-management.component').then(m => m.AdminManagementComponent)
      },
      {
        path: 'planifications',
        loadComponent: () => import('./components/admin/planification-management/planification-management.component').then(m => m.PlanificationManagementComponent)
      }
    ]
  },
  
  {
    path: '**',
    redirectTo: '/login'
  }
];