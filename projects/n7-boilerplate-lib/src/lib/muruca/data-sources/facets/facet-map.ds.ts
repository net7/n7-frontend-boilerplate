import { DataSource } from '@n7-frontend/core';
import { MapData, MarkerData } from '@n7-frontend/components';
import 'leaflet.markercluster';
import { Subject } from 'rxjs';
import { FacetDataSource } from './facet-datasource';
// leaflet is already present in the window,
// a double import results in errors with tooltips.
declare const L;

type FACET_VALUE = string | null;

type CadastralUnit = {
  text: string;
  payload: string;
  counter: 1;
  args: {
    lat: string | null;
    lon: string | null;
  };
}

export interface MarkerEvent {
  type: string;
  id: string;
}

interface MarkerWithID extends MarkerData {
  id?: string;
  slug: string;
}

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

export class FacetMapDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  mapInstance;

  markerLayer;

  markerEvents$ = new Subject<MarkerEvent>();

  protected transform({ links }: { links: CadastralUnit[] }): MapData {
    const markers = links
      .filter((d) => d.args?.lat && d.args?.lon)
      .map((d) => ({
        coords: [+d.args.lat, +d.args.lon] as [number, number],
        template: d.text,
        title: d.text,
        id: d.payload,
        slug: d.payload,
      }));
    return {
      containerId: 'map-canvas',
      tileLayers: [{
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        options: {
          attribution: null,
        },
      }],
      initialView: {
        center: [46.49, 11.33],
        zoom: 8
      },
      // markers,
      _setInstance: (map) => {
        this.mapInstance = map;
        this.buildMarkers(markers);
        // const markerCluster = (L as any).markerClusterGroup();
      },
      // _setMarkerLayer: (markerLayer) => {
      //   this.markerLayer = markerLayer;
      // }
    };
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
    const markerGroup = L.markerClusterGroup();
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

      newMarker.on('click', ({ target }) => {
        this.markerEvents$.next({
          type: 'marker.click',
          id: target.id
        });
      });
    });
    // add the markers to the map instance
    this.mapInstance.addLayer(markerGroup);
    // update the marker layer instance
    this.markerLayer = markerGroup;
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = value;

    if (update) {
      this.update({
        ...this.input,
        value
      });
    }
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = null;
  }
}
