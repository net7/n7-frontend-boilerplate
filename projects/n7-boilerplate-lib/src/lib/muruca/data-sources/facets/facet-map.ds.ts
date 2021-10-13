import { DataSource } from '@n7-frontend/core';
import { MapData } from '@n7-frontend/components';
import { FacetDataSource } from './facet-datasource';

type FACET_VALUE = string | null;

export class FacetMapDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform(data: MapData): MapData {
    return {
      containerId: 'map-canvas',
      tileLayers: [{
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        options: {}
      }],
      initialView: {
        center: [51.505, -0.09],
        zoom: 13
      },
      markers: [
        {
          coords: [51.505, -0.09],
          template: 'This is the center of the map',
          title: 'London'
        }, {
          coords: [51.495, -0.1],
          template: 'Elephant and castle',
        }, {
          coords: [51.46687084654015, -0.2130156755447388],
          template: 'Putney bridge',
        }
      ],
      ...data
    };
  }

  setValue(value: FACET_VALUE, update = false) {
    this.value = value;

    if (update) {
      this.update({
        ...this.input,
        value
      });

      // fix element update
      const el = document.getElementById(this.output.id) as HTMLInputElement;
      if (el) {
        el.value = value;
      }
    }
  }

  getValue = (): FACET_VALUE => this.value;

  clear() {
    this.value = null;
  }
}
