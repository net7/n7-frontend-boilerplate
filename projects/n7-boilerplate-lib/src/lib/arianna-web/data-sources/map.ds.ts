import { MapData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import * as Leaflet from 'leaflet';
import { Subject } from 'rxjs';

export class AwMapDS extends DataSource {
  public map;

  public markerOpen$: Subject<object> = new Subject();

  public markerClose$: Subject<void> = new Subject();

  protected transform = (data): MapData => ({
    containerId: 'map-canvas',
    tileLayers: [{
      url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
      options: {}
    }],
    initialView: {
      center: [0, 0],
      zoom: 13
    },
    _setInstance: (map) => {
      this.map = map;
      const bounds = new Leaflet.LatLngBounds(data.map(({ lat, lon }) => [lat, lon]));
      this.map.fitBounds(bounds);

      // adding markers
      const markers = Leaflet.markerClusterGroup();
      data.forEach(({ lat, lon, item }) => {
        const { label } = item;
        const marker = Leaflet.marker([lat, lon])
          .addTo(markers)
          .bindPopup(label)
          .on('click', () => {
            this.markerOpen$.next(item);
          });

        marker.getPopup().on('remove', () => {
          this.markerClose$.next();
        });
      });
      this.map.addLayer(markers);
    }
  });
}
