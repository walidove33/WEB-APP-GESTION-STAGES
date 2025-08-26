import { Injectable } from "@angular/core"
import { BehaviorSubject, type Observable } from "rxjs"

export interface Toast {
  id: string
  message: string
  type: "success" | "error" | "info" | "warning"
  duration?: number
}

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([])
  public toasts$: Observable<Toast[]> = this.toastsSubject.asObservable()

  private toasts: Toast[] = []

  success(message: string, duration = 5000): void {
    this.show(message, "success", duration)
  }

  error(message: string, duration = 8000): void {
    this.show(message, "error", duration)
  }

  info(message: string, duration = 5000): void {
    this.show(message, "info", duration)
  }

  warning(message: string, duration = 6000): void {
    this.show(message, "warning", duration)
  }

  private show(message: string, type: Toast["type"], duration = 5000): void {
    const id = this.generateId()
    const toast: Toast = { id, message, type, duration }

    this.toasts.push(toast)
    this.toastsSubject.next([...this.toasts])

    console.log(`🍞 Toast ${type}:`, message)

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        this.remove(id)
      }, duration)
    }

    // Fallback for critical errors
    if (type === "error") {
      console.error("❌", message)
    } else if (type === "success") {
      console.log("✅", message)
    } else {
      console.log("ℹ️", message)
    }
  }

  remove(id: string): void {
    this.toasts = this.toasts.filter((toast) => toast.id !== id)
    this.toastsSubject.next([...this.toasts])
  }

  clear(): void {
    this.toasts = []
    this.toastsSubject.next([])
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9)
  }
}

