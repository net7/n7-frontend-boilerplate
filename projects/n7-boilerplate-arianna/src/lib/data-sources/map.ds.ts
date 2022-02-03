import { MapData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import * as Leaflet from 'leaflet';
import { Subject } from 'rxjs';

const MARKER_ICON = Leaflet.icon({
  iconUrl: '/assets/pin.png',
  iconSize: [30, 45.5],
  popupAnchor: [0, -25],
  className: 'marker-icon'
});

const MARKER_ICON_SELECTED = Leaflet.icon({
  iconUrl: '/assets/pin-selected.png',
  iconSize: [30, 45.5],
  popupAnchor: [0, -25],
  className: 'marker-icon-selected'
});

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
      const bounds = new Leaflet
        .LatLngBounds(data
          .filter((d) => this.isValidMarker(d))
          .map(({ lat, lon }) => [lat, lon]));
      this.map.fitBounds(bounds);

      // adding markers
      const markers = Leaflet.markerClusterGroup({
        showCoverageOnHover: false,
      });
      data
        // skip broken markers
        .filter((d) => (this.isValidMarker(d)))
        // draw markers on the map
        .forEach(({ lat, lon, item }) => {
          const { label } = item;
          const marker = Leaflet.marker([lat, lon], { icon: MARKER_ICON })
            .addTo(markers)
            .bindPopup(label)
            .on('click', ({ target }) => {
              const { icon } = target.options;
              const { className } = icon.options;
              if (className === 'marker-icon-selected') {
                this.markerOpen$.next(item);
              }
            });

          marker.getPopup().on('remove', ({ target }) => {
            target._source.setIcon(MARKER_ICON);
            this.markerClose$.next();
          });

          marker.getPopup().on('add', ({ target }) => {
            target._source.setIcon(MARKER_ICON_SELECTED);
          });
        });
      this.map.addLayer(markers);
    }
  });

  /**
   * Performs validation for a leaflet marker data.
   * If the data is invalid displays an error.
   *
   * @param marker data for a leaflet marker
   * @returns true if the marker data is valid
   */
  private isValidMarker({ lat, lon }): boolean {
    const test = (
      lat
      && lon
      && /^-?\d+\.\d*$/.test(lat)
      && /^-?\d+\.\d*$/.test(lon)
    );
    if (test) return true;
    console.error(`${lat}, ${lon} is not a valid marker!`);
    return false;
  }
}
