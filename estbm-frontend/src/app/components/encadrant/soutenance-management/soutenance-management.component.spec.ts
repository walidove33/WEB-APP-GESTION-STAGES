import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoutenanceManagementComponent } from './soutenance-management.component';

describe('SoutenanceManagementComponent', () => {
  let component: SoutenanceManagementComponent;
  let fixture: ComponentFixture<SoutenanceManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoutenanceManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoutenanceManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
