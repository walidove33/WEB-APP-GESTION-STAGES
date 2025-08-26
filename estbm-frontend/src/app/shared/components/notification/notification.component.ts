

// import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Subject, takeUntil } from 'rxjs';
// import { NotificationService, Notification } from '../../../services/notification.service';

// @Component({
//   selector: 'app-notification',
//   standalone: true,
//   imports: [CommonModule],
//   changeDetection: ChangeDetectionStrategy.OnPush,
//   template: `
//     <div class="notification-container">
//       <div *ngFor="let notification of notifications; trackBy: trackByFn" 
//            class="notification-item"
//            [ngClass]="getNotificationClasses(notification)"
//            [@slideIn]>
        
//         <div class="notification-icon">
//           <i *ngIf="notification.type !== 'loading'" [ngClass]="getIconClass(notification.type)"></i>
//           <div *ngIf="notification.type === 'loading'" class="loading-spinner"></div>
//         </div>
        
//         <div class="notification-content">
//           <div class="notification-title">{{ notification.title }}</div>
//           <div class="notification-message" *ngIf="notification.message">
//             {{ notification.message }}
//           </div>
          
//           <!-- Progress bar for loading notifications -->
//           <div *ngIf="notification.type === 'loading' && notification.progress !== undefined" 
//                class="notification-with-progress">
//             <div class="progress-container">
//               <div class="progress-bar">
//                 <div class="progress-fill" [style.width.%]="notification.progress"></div>
//               </div>
//               <div class="progress-text">
//                 <span class="progress-label">Progression</span>
//                 <span class="progress-percentage">{{ notification.progress }}%</span>
//               </div>
//             </div>
//           </div>
          
//           <!-- Action buttons -->
//           <div class="notification-actions" *ngIf="notification.actions && notification.actions.length > 0">
//             <button *ngFor="let action of notification.actions" 
//                     class="notification-btn"
//                     [ngClass]="'btn-' + action.style"
//                     (click)="executeAction(action, notification)">
//               {{ action.label }}
//             </button>
//           </div>
//         </div>
        
//         <button class="notification-close" 
//                 *ngIf="!notification.persistent"
//                 (click)="removeNotification(notification.id)"
//                 [attr.aria-label]="'Fermer la notification: ' + notification.title">
//           <i class="bi bi-x"></i>
//         </button>
        
//         <!-- Auto-dismiss progress bar -->
//         <div *ngIf="notification.duration > 0 && !notification.persistent" 
//              class="notification-progress"
//              [style.animation-duration]="notification.duration + 'ms'"></div>
//       </div>
//     </div>
//   `,
//   styleUrls: ['./notification.component.scss']
// })
// export class NotificationComponent implements OnInit, OnDestroy {
//   private destroy$ = new Subject<void>();
//   notifications: Notification[] = [];

//   constructor(
//     private notificationService: NotificationService,
//     private cdr: ChangeDetectorRef
//   ) {}

//   ngOnInit(): void {
//     this.notificationService.notifications$
//       .pipe(takeUntil(this.destroy$))
//       .subscribe(notifications => {
//         this.notifications = notifications;
//         this.cdr.markForCheck();
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }

//   trackByFn(index: number, item: Notification): string {
//     return item.id;
//   }

//   getIconClass(type: string): string {
//     const iconMap: { [key: string]: string } = {
//       success: 'bi bi-check-circle-fill',
//       error: 'bi bi-exclamation-triangle-fill',
//       warning: 'bi bi-exclamation-circle-fill',
//       info: 'bi bi-info-circle-fill'
//     };
//     return iconMap[type] || 'bi bi-info-circle-fill';
//   }

//   getNotificationClasses(notification: Notification): string {
//     const classes = [`notification-${notification.type}`];
    
//     if (notification.animation) {
//       classes.push(`animate-${notification.animation}`);
//     } else {
//       classes.push('animate-slide');
//     }

//     // Add special classes for specific types
//     if (notification.type === 'success' && notification.title.toLowerCase().includes('créé')) {
//       classes.push('celebrate');
//     }

//     if (notification.type === 'loading') {
//       classes.push('notification-loading');
//     }

//     return classes.join(' ');
//   }

//   removeNotification(id: string): void {
//     // Add removing class for exit animation
//     const element = document.querySelector(`[data-notification-id="${id}"]`);
//     if (element) {
//       element.classList.add('removing');
//       setTimeout(() => {
//         this.notificationService.remove(id);
//       }, 300);
//     } else {
//       this.notificationService.remove(id);
//     }
//   }

//   executeAction(action: any, notification: Notification): void {
//     action.action();
    
//     // Auto-remove notification after action unless it's persistent
//     if (!notification.persistent) {
//       setTimeout(() => {
//         this.removeNotification(notification.id);
//       }, 500);
//     }
//   }

//   // Method to handle notification click (for expandable notifications)
//   onNotificationClick(notification: Notification): void {
//     if (notification.type === 'info' && notification.message) {
//       // Toggle expanded state or navigate
//       console.log('Notification clicked:', notification);
//     }
//   }

//   // Method to handle notification swipe (for mobile)
//   onNotificationSwipe(notification: Notification, direction: 'left' | 'right'): void {
//     if (direction === 'right' && !notification.persistent) {
//       this.removeNotification(notification.id);
//     }
//   }

//   // Method to pause auto-dismiss on hover
//   onNotificationHover(notification: Notification, isHovering: boolean): void {
//     if (notification.duration > 0 && !notification.persistent) {
//       const element = document.querySelector(`[data-notification-id="${notification.id}"] .notification-progress`);
//       if (element) {
//         (element as HTMLElement).style.animationPlayState = isHovering ? 'paused' : 'running';
//       }
//     }
//   }
// }


import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService, Notification } from '../../../services/notification.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateY(-10px)', opacity: 0 }),
        animate('220ms cubic-bezier(.2,.8,.2,1)', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('180ms cubic-bezier(.4,.0,.2,1)', style({ transform: 'translateY(-10px)', opacity: 0 }))
      ])
    ])
  ],
  template: `
    <div class="notification-container">
      <div *ngFor="let notification of notifications; trackBy: trackByFn"
           class="notification-item"
           [ngClass]="getNotificationClasses(notification)"
           [@slideIn]
           [attr.data-notification-id]="notification.id">

        <div class="notification-icon">
          <i *ngIf="notification.type !== 'loading'" [ngClass]="getIconClass(notification.type)"></i>
          <div *ngIf="notification.type === 'loading'" class="loading-spinner"></div>
        </div>

        <div class="notification-content">
          <div class="notification-title">{{ notification.title }}</div>
          <div class="notification-message" *ngIf="notification.message">
            {{ notification.message }}
          </div>

          <div *ngIf="notification.type === 'loading' && notification.progress !== undefined"
               class="notification-with-progress">
            <div class="progress-container">
              <div class="progress-bar">
                <div class="progress-fill" [style.width.%]="notification.progress"></div>
              </div>
              <div class="progress-text">
                <span class="progress-label">Progression</span>
                <span class="progress-percentage">{{ notification.progress }}%</span>
              </div>
            </div>
          </div>

          <div class="notification-actions" *ngIf="notification.actions && notification.actions.length > 0">
            <button *ngFor="let action of notification.actions"
                    class="notification-btn"
                    [ngClass]="'btn-' + action.style"
                    (click)="executeAction(action, notification)">
              {{ action.label }}
            </button>
          </div>
        </div>

        <button class="notification-close"
                *ngIf="!notification.persistent"
                (click)="removeNotification(notification.id)"
                [attr.aria-label]="'Fermer la notification: ' + notification.title">
          <i class="bi bi-x"></i>
        </button>

        <div *ngIf="notification.duration > 0 && !notification.persistent"
             class="notification-progress"
             [style.animation-duration]="notification.duration + 'ms'"></div>
      </div>
    </div>
  `,
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  notifications: Notification[] = [];

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.notificationService.notifications$
      .pipe(takeUntil(this.destroy$))
      .subscribe(notifications => {
        this.notifications = notifications;
        this.cdr.markForCheck();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  trackByFn(index: number, item: Notification): string {
    return item.id;
  }

  getIconClass(type: string): string {
    const iconMap: { [key: string]: string } = {
      success: 'bi bi-check-circle-fill',
      error: 'bi bi-exclamation-triangle-fill',
      warning: 'bi bi-exclamation-circle-fill',
      info: 'bi bi-info-circle-fill'
    };
    return iconMap[type] || 'bi bi-info-circle-fill';
  }

  getNotificationClasses(notification: Notification): string {
    const classes = [`notification-${notification.type}`];

    if (notification.animation) {
      classes.push(`animate-${notification.animation}`);
    } else {
      classes.push('animate-slide');
    }

    if (notification.type === 'success' && notification.title.toLowerCase().includes('créé')) {
      classes.push('celebrate');
    }

    if (notification.type === 'loading') {
      classes.push('notification-loading');
    }

    return classes.join(' ');
  }

  removeNotification(id: string): void {
    const element = document.querySelector(`[data-notification-id="${id}"]`);
    if (element) {
      element.classList.add('removing');
      setTimeout(() => {
        this.notificationService.remove(id);
      }, 300);
    } else {
      this.notificationService.remove(id);
    }
  }

  executeAction(action: any, notification: Notification): void {
    action.action();
    if (!notification.persistent) {
      setTimeout(() => {
        this.removeNotification(notification.id);
      }, 500);
    }
  }

  onNotificationClick(notification: Notification): void {
    if (notification.type === 'info' && notification.message) {
      console.log('Notification clicked:', notification);
    }
  }

  onNotificationSwipe(notification: Notification, direction: 'left' | 'right'): void {
    if (direction === 'right' && !notification.persistent) {
      this.removeNotification(notification.id);
    }
  }

  onNotificationHover(notification: Notification, isHovering: boolean): void {
    if (notification.duration > 0 && !notification.persistent) {
      const element = document.querySelector(`[data-notification-id="${notification.id}"] .notification-progress`);
      if (element) {
        (element as HTMLElement).style.animationPlayState = isHovering ? 'paused' : 'running';
      }
    }
  }
}
