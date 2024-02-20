import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantStatusPage } from './plant-status.page';

describe('PlantStatusPage', () => {
  let component: PlantStatusPage;
  let fixture: ComponentFixture<PlantStatusPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantStatusPage]
    }).compileComponents();

    fixture = TestBed.createComponent(PlantStatusPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
