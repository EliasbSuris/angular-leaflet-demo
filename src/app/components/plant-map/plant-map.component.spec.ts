import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMapComponent } from './plant-map.component';

describe('PlantMapComponent', () => {
  let component: PlantMapComponent;
  let fixture: ComponentFixture<PlantMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlantMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
