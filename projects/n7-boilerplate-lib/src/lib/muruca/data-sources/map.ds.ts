import { MapData } from '@n7-frontend/components';
import { DataSource } from '@n7-frontend/core';

export class MrMapDS extends DataSource {
  id: string;

  mapInstance;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected transform(data: any): MapData {
    return {
      _setInstance: (instance) => {
        this.mapInstance = instance;
      },
      containerId: 'map-canvas',
      libOptions: {
        scrollWheelZoom: false,
      },
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
      ]
    };
  }
}
