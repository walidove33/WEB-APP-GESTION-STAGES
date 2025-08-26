import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoutenanceViewComponent } from './soutenance-view.component';

describe('SoutenanceViewComponent', () => {
  let component: SoutenanceViewComponent;
  let fixture: ComponentFixture<SoutenanceViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SoutenanceViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SoutenanceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
