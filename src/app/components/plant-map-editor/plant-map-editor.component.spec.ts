import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMapEditorComponent } from './plant-map-editor.component';

describe('PlantMapEditorComponent', () => {
  let component: PlantMapEditorComponent;
  let fixture: ComponentFixture<PlantMapEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlantMapEditorComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlantMapEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
