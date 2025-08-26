import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncadrantManagementComponent } from './encadrant-management.component';

describe('EncadrantManagementComponent', () => {
  let component: EncadrantManagementComponent;
  let fixture: ComponentFixture<EncadrantManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EncadrantManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EncadrantManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
