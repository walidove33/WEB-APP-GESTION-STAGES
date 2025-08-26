import { Component, Input, Output, EventEmitter, TemplateRef, ContentChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface TableColumn<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  type?: 'text' | 'date' | 'badge' | 'actions' | 'custom';
  template?: TemplateRef<any>;
  badgeClass?: (value: any) => string;
  format?: (value: any) => string;
}

export interface TableAction<T> {
  label: string;
  icon: string;
  class?: string;
  action: (item: T) => void;
  visible?: (item: T) => boolean;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="data-table-container">
      <!-- Table Header -->
      <div class="table-header" *ngIf="showHeader">
        <div class="table-title">
          <h3>{{ title }}</h3>
          <p *ngIf="subtitle">{{ subtitle }}</p>
        </div>
        
        <div class="table-controls">
          <!-- Search -->
          <div class="search-box" *ngIf="searchable">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              placeholder="Rechercher..."
              [(ngModel)]="searchTerm"
              (input)="onSearch()">
          </div>
          
          <!-- Actions -->
          <div class="header-actions">
            <ng-content select="[slot=header-actions]"></ng-content>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div class="table-wrapper">
        <table class="modern-table">
          <thead>
            <tr>
              <th *ngFor="let column of columns" 
                  [style.width]="column.width"
                  [class.sortable]="column.sortable"
                  (click)="onSort(column)">
                <div class="th-content">
                  <span>{{ column.label }}</span>
                  <i *ngIf="column.sortable && sortColumn === column.key" 
                     class="bi"
                     [ngClass]="sortDirection === 'asc' ? 'bi-chevron-up' : 'bi-chevron-down'"></i>
                </div>
              </th>
              <th *ngIf="actions && actions.length > 0" class="actions-column">Actions</th>
            </tr>
          </thead>
          
          <tbody>
            <!-- Loading state -->
            <tr *ngIf="loading" class="loading-row">
              <td [attr.colspan]="getColumnCount()">
                <div class="loading-cell">
                  <div class="spinner"></div>
                  <span>{{ loadingMessage || 'Chargement...' }}</span>
                </div>
              </td>
            </tr>

            <!-- Empty state -->
            <tr *ngIf="!loading && filteredData.length === 0" class="empty-row">
              <td [attr.colspan]="getColumnCount()">
                <div class="empty-cell">
                  <i class="bi" [ngClass]="emptyIcon"></i>
                  <h5>{{ emptyTitle || 'Aucune donnée' }}</h5>
                  <p>{{ emptyMessage || 'Aucun élément à afficher' }}</p>
                </div>
              </td>
            </tr>

            <!-- Data rows -->
            <tr *ngFor="let item of paginatedData; let i = index" 
                class="data-row"
                [class.selected]="isSelected(item)"
                (click)="onRowClick(item)">
              
              <td *ngFor="let column of columns" [class]="'column-' + column.type">
                <!-- Text column -->
                <span *ngIf="column.type === 'text' || !column.type">
                  {{ getValue(item, column) }}
                </span>
                
                <!-- Date column -->
                <span *ngIf="column.type === 'date'" class="date-cell">
                  <i class="bi bi-calendar-event me-1"></i>
                  {{ getValue(item, column) | date:'dd/MM/yyyy' }}
                </span>
                
                <!-- Badge column -->
                <span *ngIf="column.type === 'badge'" 
                      class="badge"
                      [ngClass]="column.badgeClass ? column.badgeClass(getValue(item, column)) : 'badge-secondary'">
                  {{ column.format ? column.format(getValue(item, column)) : getValue(item, column) }}
                </span>
                
                <!-- Custom template -->
                <ng-container *ngIf="column.type === 'custom' && column.template">
                  <ng-container *ngTemplateOutlet="column.template; context: { $implicit: item, value: getValue(item, column) }"></ng-container>
                </ng-container>
              </td>
              
              <!-- Actions column -->
              <td *ngIf="actions && actions.length > 0" class="actions-cell">
                <div class="action-buttons">
                  <button *ngFor="let action of getVisibleActions(item)"
                          class="btn btn-sm"
                          [ngClass]="action.class || 'btn-outline-primary'"
                          (click)="executeAction(action, item, $event)"
                          [title]="action.label">
                    <i class="bi" [ngClass]="action.icon"></i>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="table-footer" *ngIf="showPagination && !loading">
        <div class="pagination-info">
          <span>{{ getStartIndex() + 1 }} - {{ getEndIndex() }} sur {{ filteredData.length }} éléments</span>
        </div>
        
        <div class="pagination-controls">
          <button class="btn btn-sm btn-outline-secondary"
                  [disabled]="currentPage === 1"
                  (click)="previousPage()">
            <i class="bi bi-chevron-left"></i>
          </button>
          
          <div class="page-numbers">
            <button *ngFor="let page of getPageNumbers()"
                    class="btn btn-sm"
                    [ngClass]="page === currentPage ? 'btn-primary' : 'btn-outline-secondary'"
                    (click)="goToPage(page)">
              {{ page }}
            </button>
          </div>
          
          <button class="btn btn-sm btn-outline-secondary"
                  [disabled]="currentPage === totalPages"
                  (click)="nextPage()">
            <i class="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent<T> {
  @Input() data: T[] = [];
  @Input() columns: TableColumn<T>[] = [];
  @Input() actions?: TableAction<T>[];
  @Input() loading = false;
  @Input() searchable = true;
  @Input() sortable = true;
  @Input() showHeader = true;
  @Input() showPagination = true;
  @Input() pageSize = 10;
  @Input() title?: string;
  @Input() subtitle?: string;
  @Input() loadingMessage?: string;
  @Input() emptyTitle?: string;
  @Input() emptyMessage?: string;
  @Input() emptyIcon = 'bi-inbox';
  @Input() selectable = false;
  @Input() selectedItems: T[] = [];

  @Output() rowClick = new EventEmitter<T>();
  @Output() selectionChange = new EventEmitter<T[]>();

  searchTerm = '';
  sortColumn: keyof T | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';
  currentPage = 1;
  filteredData: T[] = [];
  paginatedData: T[] = [];

  ngOnInit(): void {
    this.updateData();
  }

  ngOnChanges(): void {
    this.updateData();
  }

  private updateData(): void {
    this.filterData();
    this.sortData();
    this.paginateData();
  }

  private filterData(): void {
    if (!this.searchTerm.trim()) {
      this.filteredData = [...this.data];
      return;
    }

    const term = this.searchTerm.toLowerCase();
    this.filteredData = this.data.filter(item => {
      return this.columns.some(column => {
        const value = this.getValue(item, column);
        return value?.toString().toLowerCase().includes(term);
      });
    });
  }

  private sortData(): void {
    if (!this.sortColumn) return;

    this.filteredData.sort((a, b) => {
      const aValue = this.getValue(a, { key: this.sortColumn } as TableColumn<T>);
      const bValue = this.getValue(b, { key: this.sortColumn } as TableColumn<T>);

      let comparison = 0;
      if (aValue > bValue) comparison = 1;
      if (aValue < bValue) comparison = -1;

      return this.sortDirection === 'desc' ? -comparison : comparison;
    });
  }

  private paginateData(): void {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
  }

  getValue(item: T, column: TableColumn<T>): any {
    const keys = String(column.key).split('.');
    let value = item;
    
    for (const key of keys) {
      value = (value as any)?.[key];
    }
    
    return value;
  }

  onSearch(): void {
    this.currentPage = 1;
    this.updateData();
  }

  onSort(column: TableColumn<T>): void {
    if (!column.sortable) return;

    if (this.sortColumn === column.key) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column.key;
      this.sortDirection = 'asc';
    }

    this.updateData();
  }

  onRowClick(item: T): void {
    if (this.selectable) {
      this.toggleSelection(item);
    }
    this.rowClick.emit(item);
  }

  toggleSelection(item: T): void {
    const index = this.selectedItems.findIndex(selected => selected === item);
    if (index > -1) {
      this.selectedItems.splice(index, 1);
    } else {
      this.selectedItems.push(item);
    }
    this.selectionChange.emit(this.selectedItems);
  }

  isSelected(item: T): boolean {
    return this.selectedItems.includes(item);
  }

  executeAction(action: TableAction<T>, item: T, event: Event): void {
    event.stopPropagation();
    action.action(item);
  }

  getVisibleActions(item: T): TableAction<T>[] {
    return this.actions?.filter(action => 
      !action.visible || action.visible(item)
    ) || [];
  }

  getColumnCount(): number {
    let count = this.columns.length;
    if (this.actions && this.actions.length > 0) count++;
    return count;
  }

  // Pagination methods
  get totalPages(): number {
    return Math.ceil(this.filteredData.length / this.pageSize);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.pageSize;
  }

  getEndIndex(): number {
    return Math.min(this.getStartIndex() + this.pageSize, this.filteredData.length);
  }

  getPageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisible = 5;
    const start = Math.max(1, this.currentPage - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible - 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateData();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateData();
    }
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.updateData();
  }
}