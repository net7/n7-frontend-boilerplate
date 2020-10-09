import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class AwMapLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-map-layout.init':
          this.dataSource.onInit(payload);
          this.emitOuter('init', payload);
          break;

        case 'aw-map-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-map.markeropen':
          console.log(type, payload);
          break;
        case 'aw-map.markerclose':
          console.log(type, payload);
          break;
        default:
          break;
      }
    });
  }
}
