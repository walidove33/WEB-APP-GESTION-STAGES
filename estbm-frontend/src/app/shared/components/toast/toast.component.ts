import { Component } from "@angular/core"
import { CommonModule } from "@angular/common"
import  { Toast, ToastService } from "../../../services/toast.service"

@Component({
  selector: "app-toast",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container" *ngIf="(toastService.toasts$ | async) as toasts">
      <div 
        *ngFor="let toast of toasts"
        class="toast"
        [ngClass]="'toast-' + toast.type"
        [@slideIn]
      >
        <div class="toast-content">
          <div class="toast-icon">
            <i [ngClass]="getIconClass(toast.type)"></i>
          </div>
          <div class="toast-message">{{ toast.message }}</div>
          <button 
            class="toast-close"
            (click)="toastService.remove(toast.id)"
            aria-label="Fermer"
          >
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .toast-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 9999;
      max-width: 400px;
    }

    .toast {
      margin-bottom: 10px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      animation: slideIn 0.3s ease-out;
    }

    .toast-content {
      display: flex;
      align-items: center;
      padding: 12px 16px;
      background: white;
    }

    .toast-icon {
      margin-right: 12px;
      font-size: 18px;
    }

    .toast-message {
      flex: 1;
      font-size: 14px;
      line-height: 1.4;
    }

    .toast-close {
      background: none;
      border: none;
      font-size: 16px;
      cursor: pointer;
      padding: 4px;
      margin-left: 8px;
      opacity: 0.7;
      transition: opacity 0.2s;
    }

    .toast-close:hover {
      opacity: 1;
    }

    .toast-success {
      border-left: 4px solid #10b981;
    }

    .toast-success .toast-icon {
      color: #10b981;
    }

    .toast-error {
      border-left: 4px solid #ef4444;
    }

    .toast-error .toast-icon {
      color: #ef4444;
    }

    .toast-warning {
      border-left: 4px solid #f59e0b;
    }

    .toast-warning .toast-icon {
      color: #f59e0b;
    }

    .toast-info {
      border-left: 4px solid #3b82f6;
    }

    .toast-info .toast-icon {
      color: #3b82f6;
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  `,
  ],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getIconClass(type: Toast["type"]): string {
    const iconMap = {
      success: "bi bi-check-circle-fill",
      error: "bi bi-exclamation-triangle-fill",
      warning: "bi bi-exclamation-circle-fill",
      info: "bi bi-info-circle-fill",
    }
    return iconMap[type] || "bi bi-info-circle-fill"
  }
}
