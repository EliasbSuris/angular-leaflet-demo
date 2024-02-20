// Import Leaflet into L in case you want to reference Leaflet types
import * as L from 'leaflet';

// Declare the leaflet module so we can modify it
declare module 'leaflet' {
  // We want to alter the control namespace
  namespace control {
    function activeLayers(
      baseLayers?: L.Control.LayersObject,
      overlays?: L.Control.LayersObject,
      options?: L.Control.LayersOptions
    ): ActiveLayers;
    function editor(opts: L.ControlOptions): Editor;
  }

  export namespace Control {
    export class ActiveLayers extends L.Layer {
      public getActiveOverlayLayers();
    }
    export class Editor {
      constructor(opts: L.ControlOptions);
      public onAdd?(map: L.Map): HTMLElement;
      public onRemove?(map: L.Map): void;
    }
  }
}
