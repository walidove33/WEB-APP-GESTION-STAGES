import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RapportListComponent } from './rapport-list.component';

describe('RapportListComponent', () => {
  let component: RapportListComponent;
  let fixture: ComponentFixture<RapportListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RapportListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RapportListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
