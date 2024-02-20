import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-plant-map-editor',
  standalone: true,
  imports: [],
  templateUrl: './plant-map-editor.component.html',
  styleUrl: './plant-map-editor.component.css',
})
export class PlantMapEditorComponent {
  @ViewChild('editor', { static: true })
  public editor!: ElementRef;
  @Output()
  public interaction = new EventEmitter<void>();

  public onClick(): void {
    this.interaction.next();
  }
}
