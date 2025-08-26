import { Component, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subject, takeUntil, filter } from 'rxjs';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { User } from '../../../models/user.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule],
  standalone: true,
  animations: [
    // Mobile menu animations
    trigger('slideInOut', [
      state('closed', style({
        transform: 'translateY(-20px)',
        opacity: 0
      })),
      state('open', style({
        transform: 'translateY(0)',
        opacity: 1
      })),
      transition('closed <=> open', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    
    // User dropdown animations
    trigger('fadeInOut', [
      state('void', style({
        opacity: 0,
        transform: 'translateY(-15px) scale(0.95)'
      })),
      state('*', style({
        opacity: 1,
        transform: 'translateY(0) scale(1)'
      })),
      transition('void <=> *', [
        animate('0.3s cubic-bezier(0.4, 0, 0.2, 1)')
      ])
    ]),
    
    // Hamburger menu animations
    trigger('hamburgerAnimation', [
      state('closed', style({})),
      state('open', style({})),
      transition('closed => open', [
        animate('0.3s ease-in-out', keyframes([
          style({ transform: 'rotate(0deg)', offset: 0 }),
          style({ transform: 'rotate(45deg)', offset: 0.5 }),
          style({ transform: 'rotate(45deg)', offset: 1 })
        ]))
      ]),
      transition('open => closed', [
        animate('0.3s ease-in-out', keyframes([
          style({ transform: 'rotate(45deg)', offset: 0 }),
          style({ transform: 'rotate(0deg)', offset: 0.5 }),
          style({ transform: 'rotate(0deg)', offset: 1 })
        ]))
      ])
    ]),
    
    // Brand logo hover animation
    trigger('logoHover', [
      state('normal', style({
        transform: 'scale(1) rotate(0deg)'
      })),
      state('hovered', style({
        transform: 'scale(1.08) rotate(3deg)'
      })),
      transition('normal <=> hovered', [
        animate('0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)')
      ])
    ])
  ]
})
export class NavbarComponent implements OnInit, OnDestroy {
  @ViewChild('navbar') navbar!: ElementRef;
  
  private destroy$ = new Subject<void>();
  
  currentUser: User | null = null;
  isScrolled = false;
  mobileMenuOpen = false;
  userMenuOpen = false;
  isLoading = false;
  logoHoverState = 'normal';
  hasLogo = false;
  
  // Animation states
  mobileMenuState = 'closed';
  userDropdownState = 'void';
  hamburgerState = 'closed';

  constructor(
    public router: Router,
    private authService: AuthService,
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Subscribe to current user
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        this.cdr.markForCheck();
      });

    // Track route changes for active link highlighting
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateActiveLink();
        this.closeMenus(); // Close mobile menu on navigation
      });

    // Check if logo exists
    this.checkLogoExists();

    // Welcome message for navbar
    if (this.currentUser) {
      this.notificationService.info(
        'Navigation',
        `Interface chargée pour ${this.currentUser.prenom} ${this.currentUser.nom}`
      );
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrolled = window.scrollY > 20;
    if (this.isScrolled !== scrolled) {
      this.isScrolled = scrolled;
      this.cdr.markForCheck();
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (this.navbar && !this.navbar.nativeElement.contains(target)) {
      this.closeMenus();
    }
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    // Close menus on Escape key
    if (event.key === 'Escape') {
      this.closeMenus();
    }
    
    // Handle arrow keys for dropdown navigation
    if (this.userMenuOpen) {
      this.handleKeyboardNavigation(event);
    }
    
    // Quick navigation shortcuts
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case 'h':
          event.preventDefault();
          this.router.navigate([this.getDashboardRoute()]);
          this.notificationService.info('Navigation', 'Retour au tableau de bord');
          break;
        case 'n':
          event.preventDefault();
          if (this.currentUser?.role === 'ETUDIANT') {
            this.router.navigate(['/student/new-stage']);
            this.notificationService.info('Navigation', 'Nouvelle demande de stage');
          }
          break;
      }
    }
  }

  @HostListener('window:resize')
  onWindowResize(): void {
    // Close mobile menu on resize to desktop
    if (window.innerWidth > 900 && this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.mobileMenuState = this.mobileMenuOpen ? 'open' : 'closed';
    this.hamburgerState = this.mobileMenuOpen ? 'open' : 'closed';
    
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = this.mobileMenuOpen ? 'hidden' : '';
    
    // Notification for accessibility
    this.notificationService.info(
      'Menu mobile',
      this.mobileMenuOpen ? 'Menu ouvert' : 'Menu fermé'
    );
    
    this.cdr.markForCheck();
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.userDropdownState = this.userMenuOpen ? '*' : 'void';
    
    // Close mobile menu if open
    if (this.mobileMenuOpen) {
      this.closeMobileMenu();
    }
    
    this.notificationService.info(
      'Menu utilisateur',
      this.userMenuOpen ? 'Profil ouvert' : 'Profil fermé'
    );
    
    this.cdr.markForCheck();
  }

  closeMenus(): void {
    const wasOpen = this.mobileMenuOpen || this.userMenuOpen;
    
    this.mobileMenuOpen = false;
    this.userMenuOpen = false;
    this.mobileMenuState = 'closed';
    this.userDropdownState = 'void';
    this.hamburgerState = 'closed';
    
    // Restore body scroll
    document.body.style.overflow = '';
    
    if (wasOpen) {
      this.notificationService.info('Navigation', 'Menus fermés');
    }
    
    this.cdr.markForCheck();
  }

  closeMobileMenu(): void {
    if (this.mobileMenuOpen) {
      this.mobileMenuOpen = false;
      this.mobileMenuState = 'closed';
      this.hamburgerState = 'closed';
      document.body.style.overflow = '';
      this.cdr.markForCheck();
    }
  }

  onLogoHover(): void {
    this.logoHoverState = 'hovered';
    this.cdr.markForCheck();
  }

  onLogoLeave(): void {
    this.logoHoverState = 'normal';
    this.cdr.markForCheck();
  }

  private handleKeyboardNavigation(event: KeyboardEvent): void {
    const menuItems = document.querySelectorAll('.dropdown-item');
    const currentIndex = Array.from(menuItems).findIndex(item => 
      item === document.activeElement
    );

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        const nextIndex = (currentIndex + 1) % menuItems.length;
        (menuItems[nextIndex] as HTMLElement).focus();
        break;
      case 'ArrowUp':
        event.preventDefault();
        const prevIndex = currentIndex <= 0 ? menuItems.length - 1 : currentIndex - 1;
        (menuItems[prevIndex] as HTMLElement).focus();
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        (document.activeElement as HTMLElement).click();
        break;
    }
  }

  private updateActiveLink(): void {
    // Update active link indicator based on current route
    const currentRoute = this.router.url;
    
    // Add visual feedback for route changes
    this.notificationService.info(
      'Navigation',
      `Page active: ${this.getPageTitle(currentRoute)}`
    );
  }

  private getPageTitle(route: string): string {
    const routeTitles: { [key: string]: string } = {
      '/student/dashboard': 'Tableau de bord étudiant',
      '/student/stages': 'Mes stages',
      '/student/new-stage': 'Nouvelle demande',
      '/student/soutenances': 'Mes soutenances',
      '/encadrant/dashboard': 'Tableau de bord encadrant',
      '/encadrant/rapports': 'Gestion des rapports',
      '/encadrant/planifications': 'Mes planifications',
      '/admin/dashboard': 'Tableau de bord admin',
      '/admin/encadrants': 'Gestion encadrants',
      '/admin/admins': 'Gestion administrateurs',
      '/admin/planifications': 'Gestion planifications'
    };
    
    return routeTitles[route] || 'Page inconnue';
  }

  private checkLogoExists(): void {
    const img = new Image();
    img.onload = () => {
      this.hasLogo = true;
      this.cdr.markForCheck();
    };
    img.onerror = () => {
      this.hasLogo = false;
      this.cdr.markForCheck();
    };
    img.src = '/assets/logo.png';
  }

  getDashboardRoute(): string {
    if (!this.currentUser) return '/login';
    
    switch (this.currentUser.role) {
      case 'ETUDIANT':
        return '/student/dashboard';
      case 'ENCADRANT':
        return '/encadrant/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }

  getInitials(user: User | null): string {
    if (!user) return '?';
    const firstInitial = user.prenom?.charAt(0) || '';
    const lastInitial = user.nom?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  }

  getFullName(user: User | null): string {
    if (!user) return 'Utilisateur';
    return `${user.prenom || ''} ${user.nom || ''}`.trim();
  }

  getRoleLabel(role: string | undefined): string {
    const roleLabels: { [key: string]: string } = {
      'ETUDIANT': 'Étudiant',
      'ENCADRANT': 'Encadrant',
      'ADMIN': 'Administrateur'
    };
    return roleLabels[role || ''] || 'Utilisateur';
  }

  getRoleBadgeColor(role: string | undefined): string {
    const roleColors: { [key: string]: string } = {
      'ETUDIANT': 'primary',
      'ENCADRANT': 'success',
      'ADMIN': 'warning'
    };
    return roleColors[role || ''] || 'secondary';
  }

  async logout(event: Event): Promise<void> {
    event.preventDefault();
    
    if (this.isLoading) return;
    
    // Direct logout without confirmation for better UX
    this.isLoading = true;
    this.cdr.markForCheck();
    
    try {
      // Add visual feedback
      const logoutBtn = event.target as HTMLElement;
      const navbar = document.querySelector('.estbm-navbar');
      
      if (logoutBtn) {
        logoutBtn.classList.add('processing');
      }
      
      if (navbar) {
        navbar.classList.add('navbar-loading');
      }
      
      // Show immediate feedback
      this.notificationService.info('Déconnexion', 'Déconnexion en cours...');
      
      // Perform logout
      this.authService.logout();
      
      // Success animation
      if (logoutBtn) {
        logoutBtn.classList.remove('processing');
        logoutBtn.classList.add('success');
      }
      
      if (navbar) {
        navbar.classList.remove('navbar-loading');
        navbar.classList.add('navbar-success');
      }
      
      // Close menus
      this.closeMenus();
      
      // Navigate after brief animation
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 800);
      
    } catch (error) {
      // console.error('Logout error:', error);
      
      const logoutBtn = event.target as HTMLElement;
      const navbar = document.querySelector('.estbm-navbar');
      
      if (logoutBtn) {
        logoutBtn.classList.remove('processing');
        logoutBtn.classList.add('error');
      }
      
      if (navbar) {
        navbar.classList.remove('navbar-loading');
        navbar.classList.add('navbar-error');
        setTimeout(() => {
          navbar.classList.remove('navbar-error');
        }, 1000);
      }
      
      this.notificationService.error(
        'Erreur de déconnexion',
        'Une erreur est survenue lors de la déconnexion'
      );
    } finally {
      this.isLoading = false;
      this.cdr.markForCheck();
    }
  }

  // ==================== NAVIGATION HELPERS ====================

  navigateToProfile(): void {
    this.notificationService.info('Profil', 'Redirection vers votre profil...');
    // TODO: Implement profile navigation
    this.closeMenus();
  }

  navigateToSettings(): void {
    this.notificationService.info('Paramètres', 'Ouverture des paramètres...');
    // TODO: Implement settings navigation
    this.closeMenus();
  }

  navigateToNotifications(): void {
    this.notificationService.info('Notifications', 'Centre de notifications...');
    // TODO: Implement notifications center
    this.closeMenus();
  }

  navigateToHelp(): void {
    this.notificationService.info('Aide', 'Ouverture de l\'aide et support...');
    // TODO: Implement help navigation
    this.closeMenus();
  }

  // ==================== ACCESSIBILITY HELPERS ====================

  announceNavigation(destination: string): void {
    this.notificationService.info('Navigation', `Navigation vers ${destination}`);
  }

  announceUserAction(action: string): void {
    this.notificationService.info('Action utilisateur', action);
  }

  // ==================== PERFORMANCE HELPERS ====================

  trackByRole(index: number, item: any): string {
    return item.role || index;
  }

  preloadRoute(route: string): void {
    // Preload route for better performance
    this.router.navigate([route]);
  }

  // ==================== THEME HELPERS ====================

  toggleTheme(): void {
    // TODO: Implement theme switching
    this.notificationService.info('Thème', 'Basculement de thème (à implémenter)');
  }

  // ==================== SEARCH HELPERS ====================

  onSearchFocus(): void {
    this.notificationService.info('Recherche', 'Recherche globale activée');
  }

  onSearchSubmit(query: string): void {
    if (query.trim()) {
      this.notificationService.info('Recherche', `Recherche pour: "${query}"`);
      // TODO: Implement global search
    }
  }

  // ==================== NOTIFICATION HELPERS ====================

  getNotificationCount(): number {
    // TODO: Implement notification count
    return 0;
  }

  hasUnreadNotifications(): boolean {
    // TODO: Implement unread notifications check
    return false;
  }


  onMobileNavItemClick(item: string): void {
    this.notificationService.info('Navigation mobile', `Sélection: ${item}`);
    this.closeMobileMenu();
  }


  onMenuAnimationDone(event: any): void {
    if (event.toState === 'closed') {
      document.body.style.overflow = '';
    }
  }

  onDropdownAnimationDone(event: any): void {
    if (event.toState === 'void') {
      this.cdr.markForCheck();
    }
  }

  onNavigationError(error: any): void {
    // console.error('Navigation error:', error);
    this.notificationService.error(
      'Erreur de navigation',
      'Impossible de naviguer vers cette page'
    );
  }


  isCurrentRoute(route: string): boolean {
    return this.router.url === route;
  }

  isRouteActive(route: string): boolean {
    return this.router.url.startsWith(route);
  }

  getRouteClass(route: string): string {
    return this.isRouteActive(route) ? 'active' : '';
  }


  debugNavbar(): void {
    console.log('🔍 Navbar Debug Info:', {
      currentUser: this.currentUser,
      isScrolled: this.isScrolled,
      mobileMenuOpen: this.mobileMenuOpen,
      userMenuOpen: this.userMenuOpen,
      currentRoute: this.router.url,
      hasLogo: this.hasLogo
    });
    
    this.notificationService.info(
      'Debug',
      'Informations de debug affichées dans la console'
    );
  }
}


