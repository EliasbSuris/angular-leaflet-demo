/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component,
  ElementRef,
  NgZone,
  ViewChild,
  ViewEncapsulation,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import * as L from 'leaflet';
import '../../../../node_modules/leaflet.active-layers/dist/leaflet.active-layers.min.js';
import { PlantMapEditorComponent } from '../plant-map-editor/plant-map-editor.component.js';

interface CustomMap extends L.Map {
  customClickHandler: L.Handler;
}

@Component({
  selector: 'app-plant-map',
  standalone: true,
  imports: [PlantMapEditorComponent],
  templateUrl: './plant-map.component.html',
  styleUrl: './plant-map.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class PlantMapComponent {
  @ViewChild('plantMap', { static: true })
  public readonly plantMap!: ElementRef;
  @ViewChild('editor', { static: true })
  public readonly editor!: ElementRef;
  @ViewChild(PlantMapEditorComponent, { static: true })
  public readonly appEditor!: PlantMapEditorComponent;

  public counter = signal(0);

  public mapImage = input.required<HTMLImageElement, string>({
    transform(value) {
      const mapImage = new Image();
      mapImage.src = value;
      mapImage.onload = (): HTMLImageElement => mapImage;
      return mapImage;
    },
  });

  public imageSrc = input.required<string>();
  private image = computed(() => {
    const mapImage = new Image();
    mapImage.src = this.imageSrc();
    return mapImage;
  });

  private map!: L.Map;
  private bounds: L.LatLngBoundsExpression = [
    [0, 0],
    [1000, 1000 * 4.71875],
  ];

  private zone = inject(NgZone);
  private activeLayers!: L.Control.ActiveLayers;
  // private overlayControls!: Record<string, L.LayerGroup>;

  constructor() {
    effect(() => {
      this.zone.runOutsideAngular(() => {
        this.initializeMap();
      });
    });
  }

  public onInteraction(): void {
    console.log('Hello from Angular Component');
  }

  private initializeMap(): void {
    const customHandler = this.createClickHandler(this.clickFn);
    // attach handler for all new created Maps
    // L.Map.addInitHook('addHandler', 'customClickHandler', customHandler);
    this.map = this.buildMap(this.plantMap.nativeElement);
    this.map.addHandler('customClickHandler', customHandler as any);
    (this.map as CustomMap).customClickHandler.enable();
    const plantImageOverlay = L.imageOverlay(this.imageSrc(), this.bounds, this.getImageOverlayOptions()).addTo(
      this.map
    );
    const imageOverlay = L.imageOverlay('/assets/plano.png', this.bounds, this.getImageOverlayOptions()).addTo(
      this.map
    );
    // if imageOverlay has interactive to true
    plantImageOverlay.on('click', event => {
      this.zone.run(() => this.counter.update(value => value + 1));
      const layers = this.activeLayers.getActiveOverlayLayers();
      const targetLayer = Object.values(layers)[0] as any;
      console.log(event, layers, targetLayer);
      const circle = this.createCircle(event.latlng.lng, event.latlng.lat, 50, 'blue');
      targetLayer.layer.addLayer(circle);
    });
    // this.map.on('click', event => console.log('MAP', event));
    this.map.fitBounds(this.bounds, { animate: true });
    // set initial zoom
    // this.map.setZoom(0);
    // set initial position and zoom but with a "smooth" animation
    // this.map.flyTo([500, 2500], 0);
    // set initial position and zoom
    this.map.setView([500, 2500], 0);

    // marker with popup and tooltip
    const marker = L.marker([500, 500]).addTo(this.map);
    const popup = L.popup().setContent('<p>Hello world!<br />This is a nice popup.</p>');
    const tooltip = L.tooltip().setContent("I'm a tooltip");
    marker.bindPopup(popup);
    marker.bindTooltip(tooltip);

    const markersOverlay = this.createMarkersOverlay();
    const vectorsOverlay = this.createVectorsOverlay();
    // markersOverlay.addLayer(this.createCircle(500, 500, 100, 'blue'));
    // Set initial visible layers
    this.map.addLayer(markersOverlay);

    const overlayControls = {
      '<span class="lf-layer-title">Markers</span>': markersOverlay,
      '<span class="lf-layer-title">Vectors</span>': vectorsOverlay,
    };
    const baseLayers = {
      Plano: imageOverlay,
      Plant: plantImageOverlay,
    };
    // add Control Layer to Map
    // L.control.layers(undefined, overlayControls).addTo(this.map);
    console.log(Object.keys(L.control));
    this.activeLayers = L.control.activeLayers(baseLayers, overlayControls);
    console.log(this.activeLayers);
    this.activeLayers.addTo(this.map);

    // const editorControl = this.createControl(this.editor);
    console.log(this.appEditor.editor.nativeElement);
    const editorControl = this.createControl(this.appEditor.editor);
    (editorControl as any).addTo(this.map);
  }

  private buildMap(mapHostElement: HTMLElement): L.Map {
    return L.map(mapHostElement, {
      /* CONTROL OPTIONS */

      // hide logo on left bottom corner
      attributionControl: false,

      /* INTERACTION OPTIONS */

      maxZoom: 2,
      minZoom: -2,
      zoomSnap: 0,
      // controls how much zoomIn/Out events will change zoom level
      zoomDelta: 1,

      /* PANNING INERTIA OPTIONS */

      // add intertia on map movement triggered by user mouse
      inertia: true,
      inertiaDeceleration: 3000,
      inertiaMaxSpeed: 1000,
      easeLinearity: 0.5,
      // makes the bounds fully solid, preventing the user from dragging outside the bounds.
      maxBoundsViscosity: 1.0,

      /* KEYBOARD NAVIGATION OPTIONS */

      keyboardPanDelta: 100,

      /* MOUSE WHEEL OPTIONS */

      scrollWheelZoom: true,
      wheelDebounceTime: 0,
      wheelPxPerZoomLevel: 30,

      /* MAP STATE OPTIONS */

      // A simple CRS that maps longitude and latitude into x and y directly.
      // May be used for maps of flat surfaces (e.g. game maps).
      // Note that the y axis should still be inverted (going from bottom to top). distance() returns simple euclidean distance.
      crs: L.CRS.Simple,
      maxBounds: this.bounds,
      // initial zoom not working has to be setted after
      // zoom: 0,
    });
  }

  private getImageOverlayOptions(): L.ImageOverlayOptions {
    return {
      alt: 'plant-map',
      // set to true when mouse events over the image are needed
      interactive: true,
    };
  }

  private createMarkersOverlay(): L.LayerGroup {
    // marker group
    const robotIcon = L.icon({
      iconUrl: '/assets/robot.svg',
      iconSize: [50, 50],
    });
    const divIcon = L.divIcon({ className: 'lf-div-icon', iconSize: [50, 50] });
    const svgMarker = L.marker([540, 2700], { icon: robotIcon, draggable: true })
      .bindTooltip('A01')
      .bindPopup("I'm a SVG icon");
    // popup calls L.DomEvent.stopPropagation
    const divMarker = L.marker([540, 2750], { icon: divIcon, bubblingMouseEvents: true }).bindTooltip("I'm a div");
    const defaultMarker = L.marker([540, 2800]).bindTooltip('Default marker');
    console.log('ID', defaultMarker);

    const markers = L.layerGroup([svgMarker, divMarker]);
    markers.addLayer(defaultMarker);

    console.log('MARKERS', markers.getLayerId(svgMarker));
    return markers;
  }

  private createVectorsOverlay(): L.LayerGroup {
    const customSvgRenderer = L.svg({ padding: 0.5 });
    const polyline = L.polyline(
      [
        [300, 2500],
        [350, 2550],
        [300, 2600],
      ],
      { color: 'green', fill: true, fillRule: 'nonzero' }
    ).bindTooltip("I'm almost a triangle!");
    const polygon = L.polyline(
      [
        [
          [300, 2650],
          [350, 2700],
          [300, 2750],
          [300, 2650],
        ],
        [
          [310, 2670],
          [340, 2700],
          [310, 2730],
          [310, 2670],
        ],
      ],
      { color: 'blue', fill: true }
    ).bindTooltip("I'm a triangle! :)");
    const rectangle = L.rectangle(
      [
        [300, 2800],
        [350, 2900],
      ],
      { color: 'yellow', bubblingMouseEvents: false, weight: 6 }
    ).bindTooltip("I'm a rectangle!");
    const circle = L.circle([325, 2950], {
      radius: 25,
      color: 'brown',
    }).bindTooltip("I'm a circle!");
    const circleCustomRenderer = L.circle([325, 3025], {
      radius: 25,
      color: 'brown',
      renderer: customSvgRenderer,
    }).bindTooltip("I'm a circle!");

    const vectors = L.layerGroup([polyline, polygon, rectangle, circle, circleCustomRenderer]);

    return vectors;
  }

  private clickFn = (ev: Event): void => {
    // console.log('CLICK', ev, this);
    this.greet();
  };

  private createClickHandler(clickFn: (ev: Event) => void): L.Class {
    const customClickHandler = L.Handler.extend({
      addHooks: function () {
        console.log(this);
        L.DomEvent.on(document as any, 'click', clickFn, this);
      },
      removeHooks: function () {
        L.DomEvent.off(document as any, 'click', clickFn, this);
      },
      // _click: function (ev: PointerEvent) {
      //   console.log('CLICK', ev, this);
      // },
    });
    return customClickHandler;
  }

  private greet(): void {
    console.log('Enjoy Javascript context :)');
  }

  private createCircle(x: number, y: number, radius: number, color: string): L.Circle {
    return L.circle([y, x], { radius, color, fill: true });
  }

  private createControl(editor: ElementRef): L.Control.Editor {
    console.log;
    L.Control.Editor = L.Control.extend({
      onAdd: function (map: L.Map) {
        console.log('DOM ELEMENT', editor, L.DomUtil.get(editor.nativeElement));
        return L.DomUtil.get(editor.nativeElement);
      },

      onRemove: function (map: L.Map) {
        // Nothing to do here
      },
    });

    L.control.editor = function (opts: L.ControlOptions): L.Control.Editor {
      return new L.Control.Editor(opts);
    };
    return L.control.editor({ position: 'bottomleft' });
  }
}
