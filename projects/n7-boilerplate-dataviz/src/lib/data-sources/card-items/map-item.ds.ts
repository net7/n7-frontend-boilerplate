import { ChartData, MapData } from '@net7/components';
import { DataSource } from '@net7/core';
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
        tileLayers: [],
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
