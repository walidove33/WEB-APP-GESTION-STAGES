

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface NotificationAction {
  label: string;
  style: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
  action: () => void;
}

export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'loading';
  title: string;
  message?: string;
  duration: number;
  actions?: NotificationAction[];
  persistent?: boolean;
  progress?: number;
  animation?: 'bounce' | 'slide' | 'fade' | 'scale';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notifications.asObservable();

  success(title: string, message?: string, duration = 5000, actions?: NotificationAction[]): void {
    this.show({
      type: 'success',
      title,
      message,
      duration,
      actions,
      animation: 'bounce'
    });
  }

  error(title: string, message?: string, duration = 8000, actions?: NotificationAction[]): void {
    this.show({
      type: 'error',
      title,
      message,
      duration,
      actions,
      animation: 'slide'
    });
  }

  warning(title: string, message?: string, duration = 6000, actions?: NotificationAction[]): void {
    this.show({
      type: 'warning',
      title,
      message,
      duration,
      actions,
      animation: 'slide'
    });
  }

  info(title: string, message?: string, duration = 5000, actions?: NotificationAction[]): void {
    this.show({
      type: 'info',
      title,
      message,
      duration,
      actions,
      animation: 'fade'
    });
  }

  loading(title: string, message?: string, persistent = true): string {
    const id = this.generateId();
    this.show({
      type: 'loading',
      title,
      message,
      duration: 0,
      persistent,
      animation: 'scale'
    }, id);
    return id;
  }

  updateProgress(id: string, progress: number): void {
    const current = this.notifications.value;
    const notification = current.find(n => n.id === id);
    if (notification) {
      notification.progress = progress;
      this.notifications.next([...current]);
    }
  }

  // Animation-specific methods
  successWithBounce(title: string, message?: string): void {
    this.show({
      type: 'success',
      title,
      message,
      duration: 4000,
      animation: 'bounce'
    });
  }

  errorWithShake(title: string, message?: string): void {
    this.show({
      type: 'error',
      title,
      message,
      duration: 6000,
      animation: 'slide'
    });
  }

  // Operation-specific notifications
  operationStart(operation: string): string {
    return this.loading(`${operation} en cours...`, 'Veuillez patienter');
  }

  operationSuccess(id: string, operation: string, details?: string): void {
    this.remove(id);
    this.successWithBounce(`${operation} réussi`, details);
  }

  operationError(id: string, operation: string, error?: string): void {
    this.remove(id);
    this.errorWithShake(`Échec ${operation}`, error);
  }

  // Batch operations
  batchOperation(operations: string[], onComplete?: () => void): void {
    let completed = 0;
    const total = operations.length;
    const batchId = this.loading('Opération en lot', `0/${total} terminées`);

    operations.forEach((op, index) => {
      setTimeout(() => {
        completed++;
        this.updateProgress(batchId, (completed / total) * 100);
        
        if (completed === total) {
          this.remove(batchId);
          this.successWithBounce('Opérations terminées', `${total} opérations réussies`);
          onComplete?.();
        } else {
          const current = this.notifications.value.find(n => n.id === batchId);
          if (current) {
            current.message = `${completed}/${total} terminées`;
            this.notifications.next([...this.notifications.value]);
          }
        }
      }, index * 500);
    });
  }

  private show(notification: Omit<Notification, 'id'>, customId?: string): void {
    const id = customId || this.generateId();
    const newNotification: Notification = { ...notification, id };
    
    const current = this.notifications.value;
    this.notifications.next([...current, newNotification]);

    // Auto remove after duration
    if (notification.duration > 0 && !notification.persistent) {
      setTimeout(() => {
        this.remove(id);
      }, notification.duration);
    }
  }

  remove(id: string): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.id !== id));
  }

  clear(): void {
    this.notifications.next([]);
  }

  // Remove all notifications of a specific type
  clearByType(type: Notification['type']): void {
    const current = this.notifications.value;
    this.notifications.next(current.filter(n => n.type !== type));
  }

  // Get notification count by type
  getCountByType(type: Notification['type']): number {
    return this.notifications.value.filter(n => n.type === type).length;
  }

  // Check if there are any error notifications
  hasErrors(): boolean {
    return this.notifications.value.some(n => n.type === 'error');
  }

  // Check if there are any loading notifications
  isLoading(): boolean {
    return this.notifications.value.some(n => n.type === 'loading');
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}