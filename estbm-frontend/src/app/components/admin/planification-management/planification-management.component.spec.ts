import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanificationManagementComponent } from './planification-management.component';

describe('PlanificationManagementComponent', () => {
  let component: PlanificationManagementComponent;
  let fixture: ComponentFixture<PlanificationManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanificationManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanificationManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
