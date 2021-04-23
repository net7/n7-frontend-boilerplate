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

export class MrMapDS extends DataSource {
  id: string;

  mapInstance;

  markerLayer;

  // eslint-disable-next-line consistent-return
  protected transform(data: TimelineResponse): MapData {
    let markers;

    if (data.find((d) => d.markers)) {
      markers = data
        .map((area) => (area.markers
          .map((m) => ({
          // convert to leaflet marker format
            coords: [+m.lat, +m.lng],
            template: m.default_label ?? m.label,
            title: m.label ?? m.default_label,
          }))))
        // flatten the list of markers
        .reduce((acc, val) => acc.concat(val), []) as MarkerData[];
    }

    const initialView: { center: [number, number]; zoom: number } = {
      center: [54.5260, 15.2551],
      zoom: 5,
    };

    if (this.mapInstance && this.markerLayer) {
      this.markerLayer.clearLayers();
      this.mapInstance.removeLayer(this.markerLayer);
      this.markerLayer = L.markerClusterGroup();
      if (markers) {
        markers.forEach((mrk) => {
          L.marker(mrk.coords)
            .addTo(this.markerLayer)
            .bindPopup(`${mrk.template}`);
        });
        this.mapInstance.addLayer(this.markerLayer);
        this.fitMapToBounds(markers.map((m) => m.coords));
      }
    }
    return {
      _setInstance: (instance) => {
        this.mapInstance = instance;
        this.fitMapToBounds(markers.map((m) => m.coords));
      },
      _setMarkerLayer: (m) => {
        this.markerLayer = m;
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
      markers: this.markerLayer ? undefined : markers
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
}
