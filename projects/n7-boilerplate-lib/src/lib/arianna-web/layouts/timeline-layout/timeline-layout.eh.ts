import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class AwTimelineLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  private configuration: any;

  private route: any;

  private entityId: string;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-timeline-layout.init':
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          this.route = payload.route;
          break;

        case 'aw-timeline-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });
  }
}
