import { ChartData, MapData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';
import { merge } from 'lodash';

export class MapItemDS extends DataSource {
  id: string;

  type: string;

  instance: any;

  protected transform(data: ChartData): ChartData {
    return data;
  }

  update(newData: Partial<MapData>) {
    if (!this.instance) {
      const formattedData: Partial<MapData> = merge({
        containerId: `map-${this.id}`,
        libOptions: {
          attributionControl: false,
        },
        tileLayers: [{
          url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
          options: {}
        }],
        initialView: {
          center: []
        },
        markers: []
      }, newData);
      formattedData._setInstance = (map) => {
        this.instance = map;
      };
      this.run(formattedData);
    } else {
      console.warn(`
        Map ${this.id} instance update is delegated on project.
        Try using the datasource instance property (ds.instance)
      `);
    }
  }
}
