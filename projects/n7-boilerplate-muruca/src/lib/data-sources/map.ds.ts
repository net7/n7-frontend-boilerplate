import { MapData, MarkerData } from '@net7/components';
import { DataSource } from '@net7/core';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Subject } from 'rxjs';
// leaflet is already present in the window,
// a double import results in errors with tooltips.
// declare const L;

interface Coords { lat: number; lng: number }

interface Marker extends Coords {
  label: string;
  default_label: string;
}

type TimelineResponse = {
  id?: number;
  title: string;
  slug: string;
  zoom: number;
  map_center: Coords;
  markers: Marker[];
}[]

interface MarkerWithID extends MarkerData {
  id?: number;
  slug: string;
}

const MARKER_ICON = L.icon({
  iconUrl: '/assets/pin.png',
  iconSize: [20, 30],
  popupAnchor: [0, -20],
  iconAnchor: [10, 30],
  className: 'marker-icon'
});

const MARKER_ICON_SELECTED = L.icon({
  iconUrl: '/assets/pin-selected.png',
  iconSize: [20, 30],
  popupAnchor: [0, -20],
  className: 'marker-icon-selected'
});

export class MrMapDS extends DataSource {
  id: string;

  /** Instance of the leaflet map */
  mapInstance;

  /** Instance of the marker layerGroup */
  markerLayer;

  mapLoaded$: Subject<L.Map> = new Subject()

  // eslint-disable-next-line consistent-return
  protected transform(data: TimelineResponse): MapData {
    let markers: MarkerWithID[];
    const d = data.find((z) => z.zoom);
    if (data.find((a) => a.markers)) {
      markers = data
        .map((area) => (area.markers
          .map((m) => ({
          // convert to leaflet marker format
            coords: [+m.lat, +m.lng] as [number, number],
            template: m.default_label ?? m.label,
            title: m.label ?? m.default_label,
            id: area.id,
            slug: area.slug,
          }))))
        // flatten the list of markers
        .reduce((acc, val) => acc.concat(val), []);
    }
    const mapCenter: [number, number] = d.map_center ? [d.map_center.lat, d.map_center.lng]
      : [54.5260, 15.2551];
    const initialView: { center: [number, number]; zoom: number } = {
    // center of europe (only for initial load)
      center: mapCenter,
      zoom: d.zoom,
    };

    // if the map and the markers already exist
    // update the already existing layers.
    if (this.mapInstance && this.markerLayer) {
      this.buildMarkers(markers);
      this.fitMapToBounds(markers.map((m) => m.coords), d.zoom);
    }

    return {
      // only called once, on component init!
      _setInstance: (instance) => {
        this.mapInstance = instance;
        // center the map on the markers
        this.fitMapToBounds(markers.map((m) => m.coords), d.zoom);
        // load custom markers
        this.buildMarkers(markers);
        this.mapLoaded$.next({ map: instance, markers: this.markerLayer });
      },
      containerId: 'map-canvas',
      libOptions: {
        ...this.options.libOptions,
      },
      tileLayers: [{
        // url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
        options: {}
      }],
      initialView,
    };
  }

  private fitMapToBounds(bounds, zoom = 10) {
    console.log(zoom);
    if (this.mapInstance) {
      this.mapInstance.fitBounds(bounds, {
        maxZoom: zoom,
        padding: [20, 20]
      });
    } else {
      console.warn('map instance is missing');
    }
  }

  /**
   * Builds markers with a custom icon and adds them to the map.
   * @param markers an array of markers
   */
  private buildMarkers(markers: MarkerWithID[]) {
    if (!markers) return;
    // remove all existing markers
    if (this.markerLayer) {
      this.markerLayer.clearLayers();
      this.mapInstance.removeLayer(this.markerLayer);
    }
    const markerGroup = L.markerClusterGroup(
      {
        maxClusterRadius: 10,
        disableClusteringAtZoom: 8
      }
    );
    markers.forEach(({
      coords, template, id, slug
    }) => {
      // create custom icon marker
      const newMarker = L.marker(coords, { icon: MARKER_ICON });
      if (id && slug) {
        newMarker.id = id;
        newMarker.slug = slug;
      }
      newMarker
        // add the marker to the group
        .addTo(markerGroup)
        // add the on-click tooltip
        .bindPopup(template);

      newMarker.getPopup().on('remove', ({ target }) => {
        target._source.setIcon(MARKER_ICON);
      });

      newMarker.getPopup().on('add', ({ target }) => {
        target._source.setIcon(MARKER_ICON_SELECTED);
      });
    });
    // add the markers to the map instance
    this.mapInstance.addLayer(markerGroup);
    // update the marker layer instance
    this.markerLayer = markerGroup;
  }
}
