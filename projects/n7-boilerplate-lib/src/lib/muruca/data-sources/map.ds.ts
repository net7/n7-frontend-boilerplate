import { MapData, MarkerData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import 'leaflet.markercluster';
// leaflet is already present in the window,
// a double import results in errors with tooltips.
declare const L;

interface Coords { lat: number; lng: number }

interface Marker extends Coords {
  label: string;
  default_label: string;
}

type TimelineResponse = {
  title: string;
  slug: string;
  zoom: number;
  map_center: Coords;
  markers: Marker[];
}[]

const MARKER_ICON = L.icon({
  iconUrl: '/assets/pin.png',
  iconSize: [30, 45.5],
  popupAnchor: [0, -25],
  className: 'marker-icon'
});

const MARKER_ICON_SELECTED = L.icon({
  iconUrl: '/assets/pin-selected.png',
  iconSize: [30, 45.5],
  popupAnchor: [0, -25],
  className: 'marker-icon-selected'
});

export class MrMapDS extends DataSource {
  id: string;

  /** Instance of the leaflet map */
  mapInstance;

  /** Instance of the marker layerGroup */
  markerLayer;

  // eslint-disable-next-line consistent-return
  protected transform(data: TimelineResponse): MapData {
    let markers: MarkerData[];

    if (data.find((d) => d.markers)) {
      markers = data
        .map((area) => (area.markers
          .map((m) => ({
          // convert to leaflet marker format
            coords: [+m.lat, +m.lng] as [number, number],
            template: m.default_label ?? m.label,
            title: m.label ?? m.default_label,
          }))))
        // flatten the list of markers
        .reduce((acc, val) => acc.concat(val), []);
    }

    const initialView: { center: [number, number]; zoom: number } = {
      // center of europe (only for initial load)
      center: [54.5260, 15.2551],
      zoom: 5,
    };

    // if the map and the markers already exist
    // update the already existing layers.
    if (this.mapInstance && this.markerLayer) {
      this.buildMarkers(markers);
      this.fitMapToBounds(markers.map((m) => m.coords));
    }

    return {
      // only called once, on component init!
      _setInstance: (instance) => {
        this.mapInstance = instance;
        // center the map on the markers
        this.fitMapToBounds(markers.map((m) => m.coords));
        // load custom markers
        this.buildMarkers(markers);
      },
      containerId: 'map-canvas',
      libOptions: {
        scrollWheelZoom: false,
      },
      tileLayers: [{
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        options: {}
      }],
      initialView,
    };
  }

  private fitMapToBounds(bounds) {
    if (this.mapInstance) {
      this.mapInstance.fitBounds(bounds, {
        maxZoom: 15,
        padding: [20, 20],
      });
    } else {
      console.warn('map instance is missing');
    }
  }

  /**
   * Builds markers with a custom icon and adds them to the map.
   * @param markers an array of markers
   */
  private buildMarkers(markers: MarkerData[]) {
    if (!markers) return;
    // remove all existing markers
    if (this.markerLayer) {
      this.markerLayer.clearLayers();
      this.mapInstance.removeLayer(this.markerLayer);
    }
    const markerGroup = L.markerClusterGroup();
    markers.forEach(({ coords, template }) => {
      // create custom icon marker
      const newMarker = L.marker(coords, { icon: MARKER_ICON })
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
