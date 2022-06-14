import { EventHandler } from '@net7/core';
import { delay, first } from 'rxjs/operators';
import { MrMapDS } from '../data-sources/map.ds';

export class MrMapEH extends EventHandler {
  dataSource: MrMapDS;

  public listen() {
    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-map-layout.routechanged':
          if (!this.dataSource.mapInstance) {
            this.dataSource.mapLoaded$.pipe(
              delay(1000), // markers loaded timeout
              first()
            ).subscribe(() => {
              this.dataSource.updateMarkersState(payload);
            });
          } else {
            this.dataSource.updateMarkersState(payload);
          }
          break;
        default:
          break;
      }
    });
  }
}
