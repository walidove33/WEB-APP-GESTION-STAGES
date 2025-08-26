import { Component, Input } from "@angular/core"
import { CommonModule } from "@angular/common"

@Component({
  selector: "app-card",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="modern-card" [ngClass]="cardClasses">
      <div *ngIf="hasHeader" class="card-header" [ngClass]="headerClasses">
        <div *ngIf="headerIcon" class="header-icon" [ngClass]="'icon-' + variant">
          <i class="bi" [ngClass]="headerIcon"></i>
        </div>
        
        <div class="header-content">
          <h3 *ngIf="title" class="card-title">{{ title }}</h3>
          <p *ngIf="subtitle" class="card-subtitle">{{ subtitle }}</p>
          <ng-content select="[slot=header-content]"></ng-content>
        </div>
        
        <div class="header-actions">
          <ng-content select="[slot=header-actions]"></ng-content>
        </div>
      </div>
      
      <div class="card-body" [ngClass]="bodyClasses">
        <ng-content></ng-content>
      </div>
      
      <div *ngIf="hasFooter" class="card-footer" [ngClass]="footerClasses">
        <ng-content select="[slot=footer]"></ng-content>
      </div>
    </div>
  `,
  styleUrls: ["./card.component.scss"],
})
export class CardComponent {
  @Input() title?: string
  @Input() subtitle?: string
  @Input() headerIcon?: string
  @Input() variant: "default" | "primary" | "success" | "warning" | "error" | "info" = "default"
  @Input() size: "sm" | "md" | "lg" = "md"
  @Input() elevated = true
  @Input() bordered = false
  @Input() hoverable = true

  get hasHeader(): boolean {
    return !!(this.title || this.subtitle || this.headerIcon)
  }

  get hasFooter(): boolean {
    // This would be determined by checking if footer content is projected
    return false // Simplified for now
  }

  get cardClasses(): string {
    const classes = []

    if (this.size) classes.push(`card-${this.size}`)
    if (this.variant !== "default") classes.push(`card-${this.variant}`)
    if (this.elevated) classes.push("card-elevated")
    if (this.bordered) classes.push("card-bordered")
    if (this.hoverable) classes.push("card-hoverable")

    return classes.join(" ")
  }

  get headerClasses(): string {
    return `header-${this.variant}`
  }

  get bodyClasses(): string {
    return `body-${this.size}`
  }

  get footerClasses(): string {
    return `footer-${this.variant}`
  }
}
