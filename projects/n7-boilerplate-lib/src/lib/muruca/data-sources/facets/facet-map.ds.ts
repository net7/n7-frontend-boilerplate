import { DataSource } from '@n7-frontend/core';
import { MapData } from '@n7-frontend/components';
import { FacetDataSource } from './facet-datasource';

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

export class FacetMapDS extends DataSource implements FacetDataSource {
  id: string;

  value: FACET_VALUE;

  protected transform({ links }: { links: CadastralUnit[] }): MapData {
    return {
      containerId: 'map-canvas',
      tileLayers: [{
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
        options: {
        },
      }],
      initialView: {
        center: [46.49, 11.33],
        zoom: 13
      },
      // libOptions: {},
      markers: links
        .filter((d) => d.args?.lat && d.args?.lon)
        .map((d) => ({
          coords: [+d.args.lat, +d.args.lon],
          template: d.text,
        })),
      // _setInstance: (map) => {
      //   console.log('map created');
      // }
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
