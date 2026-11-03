import { DataSource } from '@net7/core';
import { MapData, MarkerData } from '@net7/components';
import * as L from 'leaflet';
import 'leaflet.markercluster';
import { Subject } from 'rxjs';
import { FacetDataSource } from './facet-datasource';
import mapHelper from '../../helpers/map-helper';
// leaflet is already present in the window,
// a double import results in errors with tooltips.
// declare const L;

const ACTIVE_CLASS = 'is-active';

type FACET_VALUE = string[];

type CadastralUnit = {
  text: string;
  payload: string;
  counter: number;
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
  counter: number;
  slug: string;
}

export class FacetMapDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE = [];

  mapInstance;

  markerLayer;

  markerEvents$ = new Subject<MarkerEvent>();

  isUpdate = false;

  iconSize = this.options.libOptions.iconSize ?? [13, 20];

  private MARKER_ICON = L.icon({
    iconUrl: '/assets/pin.png',
    iconSize: this.iconSize,
    popupAnchor: [0, -15],
    className: 'marker-icon'
  });

  private MARKER_ICON_UNAVAILABLE = L.icon({
    iconUrl: '/assets/pin-unavailable.png',
    iconSize: this.iconSize,
    popupAnchor: [0, -15],
    className: 'marker-icon'
  });

  private MARKER_ICON_SELECTED = L.icon({
    iconUrl: '/assets/pin-selected.png',
    iconSize: this.iconSize,
    popupAnchor: [0, -15],
    className: 'marker-icon-selected'
  });

  private linksToMarkers(links: CadastralUnit[]): MarkerWithID[] {
    const markers: MarkerWithID[] = [];
    links
      .filter((d) => d.args?.lat && d.args?.lon)
      .forEach((d) => {
        if (Array.isArray(d.args.lat)) {
          d.args.lat.forEach((element, i) => {
            markers.push({
              coords: [+d.args.lat[i], +d.args.lon[i]] as [number, number],
              template: d.text,
              title: d.text,
              id: d.payload,
              slug: d.payload,
              counter: d.counter,
            });
          });
        } else {
          markers.push({
            coords: [+d.args.lat, +d.args.lon] as [number, number],
            template: d.text,
            title: d.text,
            id: d.payload,
            slug: d.payload,
            counter: d.counter,
          });
        }
      });
    return markers;
  }

  protected transform({ links }: { links: CadastralUnit[] }): MapData {
    const markers = this.linksToMarkers(links);
    const mapConfig = this.options?.libOptions;
    return {
      containerId: 'map-canvas',
      libOptions: {
        attributionControl: false,
        minZoom: 8,
        ...mapConfig
      },
      tileLayers: [{
        // url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        url: mapConfig.layerUrl ?? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png',
        // url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        options: null
      }],
      initialView: {
        center: mapConfig.center ?? [46.06, 11.21],
        zoom: mapConfig.zoom ?? 9
      },
      _setInstance: (map) => {
        this.mapInstance = map;
        this.buildMarkers(markers);

        if (mapConfig.autoCenter) {
          const bounds = new L
            .LatLngBounds(markers
              .map((d) => ({ lat: d.coords[0], lon: d.coords[1] }))
              .filter((d) => mapHelper.isValidMarker(d)));
          this.mapInstance.fitBounds(bounds);
        }
      },
    };
  }

  /**
   * Builds markers with a custom icon and adds them to the map.
   * @param markers an array of markers
   */
  private buildMarkers(markers: MarkerWithID[]) {
    if (!markers) return;
    const mapConfig = this.options?.libOptions;
    // remove all existing markers
    if (this.markerLayer) {
      this.markerLayer.clearLayers();
      this.mapInstance.removeLayer(this.markerLayer);
    }
    const markerGroup = L.markerClusterGroup(
      {
        maxClusterRadius: mapConfig.maxClusterRadius ?? 10,
        disableClusteringAtZoom: mapConfig.disableClusteringAtZoom ?? 8
      }
    );
    markers.forEach(({
      coords, template, id, slug, counter
    }) => {
      // create custom icon marker
      const icon = this.getIcon(id, counter);
      if (!icon) return;
      const newMarker = L.marker(coords, {
        icon,
        zIndexOffset: this.getZindex(id, counter)
      });
      if (id && slug) {
        newMarker.id = id;
        newMarker.counter = counter;
        newMarker.slug = slug;
      }
      newMarker
        // add the marker to the group
        .addTo(markerGroup)
        // add the on-click tooltip
        .bindPopup(template);

      newMarker.on('click', ({ target }) => {
        this.markerEvents$.next({
          type: 'marker.click',
          id: target.id
        });
      });

      newMarker.on('mouseover', ({ target }) => {
        target.openPopup();
      });

      newMarker.on('mouseout', ({ target }) => {
        target.closePopup();
      });
    });
    // add the markers to the map instance
    this.mapInstance.addLayer(markerGroup);
    // update the marker layer instance
    this.markerLayer = markerGroup;
  }

  setValue(value: FACET_VALUE, update = false) {
    // prevent the search service from assigning a plain string
    // eslint-disable-next-line no-param-reassign
    if (typeof value === 'string') value = [value];

    if (this.value !== value) {
      this.value = value;
    }
    this.isUpdate = update || this.value?.length === 0;

    if (update && this.input) {
      const { links } = this.input;
      const updatedLinks = links.map((link: CadastralUnit) => ({
        ...link,
        classes: this.value.includes(link.payload) ? ACTIVE_CLASS : ''
      }));
      // update marker icons
      if (this.markerLayer) {
        if (this.options.libOptions?.hideUnavailablePin) {
          this.buildMarkers(this.linksToMarkers(links));
        } else {
          this.markerLayer.eachLayer((marker) => {
            const { id } = marker;
            const counter = links.find(({ payload }) => payload === id)?.counter || 0;
            marker.getPopup()._source.setIcon(this.getIcon(id, counter))
              .setZIndexOffset(this.getZindex(id, counter));
          });
        }
      }
      // ---
      this.update({
        ...this.input,
        links: updatedLinks
      });
    }
  }

  getIcon = (id: string, counter: number) => {
    if (this.value.includes(id)) return this.MARKER_ICON_SELECTED;
    if (counter > 0) return this.MARKER_ICON;
    if (this.options.libOptions?.hideUnavailablePin) return null;
    return this.MARKER_ICON_UNAVAILABLE;
  };

  getZindex = (id: string, counter: number) => {
    if (this.value.includes(id)) return 19999;
    if (counter > 0) return 9999;
    return null;
  };

  toggleValue(value: string) {
    const exists = this.value.includes(value);
    if (!exists) {
      this.value.push(value);
    } else if (exists) {
      this.value.splice(this.value.indexOf(value), 1);
    }

    // update
    this.setValue(this.value, true);
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = [];
  }
}
