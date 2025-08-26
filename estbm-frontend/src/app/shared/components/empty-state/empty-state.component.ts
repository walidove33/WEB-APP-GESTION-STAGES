import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

export interface EmptyStateAction {
  label: string
  icon?: string
  variant?: "primary" | "secondary" | "outline"
  action: () => void
}

@Component({
  selector: "app-empty-state",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="empty-state-container" [ngClass]="'empty-state-' + size">
      <div class="empty-state-icon" [ngClass]="'icon-' + variant">
        <i class="bi" [ngClass]="icon"></i>
      </div>
      
      <div class="empty-state-content">
        <h3 class="empty-state-title">{{ title }}</h3>
        <p class="empty-state-description">{{ description }}</p>
        
        <div *ngIf="actions && actions.length > 0" class="empty-state-actions">
          <button
            *ngFor="let action of actions"
            class="btn"
            [ngClass]="'btn-' + (action.variant || 'primary')"
            (click)="action.action()">
            <i *ngIf="action.icon" class="bi" [ngClass]="action.icon"></i>
            {{ action.label }}
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ["./empty-state.component.scss"],
})
export class EmptyStateComponent {
  @Input() title!: string
  @Input() description!: string
  @Input() icon = "bi-inbox"
  @Input() size: "sm" | "md" | "lg" = "md"
  @Input() variant: "default" | "info" | "warning" | "error" = "default"
  @Input() actions?: EmptyStateAction[]
}
