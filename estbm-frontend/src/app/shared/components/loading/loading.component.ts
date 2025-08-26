import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-loading",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="loading-container" [ngClass]="'loading-' + size">
      <div class="loading-spinner" [ngClass]="'spinner-' + variant">
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
        <div class="spinner-ring"></div>
      </div>
      
      <div *ngIf="message" class="loading-message">
        {{ message }}
      </div>
      
      <div *ngIf="description" class="loading-description">
        {{ description }}
      </div>
    </div>
  `,
  styleUrls: ["./loading.component.scss"],
})
export class LoadingComponent {
  @Input() size: "sm" | "md" | "lg" = "md"
  @Input() variant: "primary" | "secondary" | "accent" = "primary"
  @Input() message?: string
  @Input() description?: string
}
