import { Component } from '@angular/core';
import { PlantMapComponent } from '../../components/plant-map/plant-map.component';

@Component({
  selector: 'app-plant-status',
  standalone: true,
  imports: [PlantMapComponent],
  templateUrl: './plant-status.page.html',
  styleUrl: './plant-status.page.css',
})
export class PlantStatusPage {
  public readonly IMAGE_SRC = '/assets/TeslaLUD.png';
}
