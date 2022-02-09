import { EventHandler } from '@net7/core';
import { Subject } from 'rxjs';

export class AwTimelineLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-timeline-layout.init':
          this.dataSource.onInit(payload);
          this.emitOuter('init', payload);
          // scroll top
          window.scrollTo(0, 0);
          break;

        case 'aw-timeline-layout.destroy':
          this.destroyed$.next();
          break;

        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-timeline.click':
          this.dataSource.onTimelineClick(payload);
          break;
        case 'n7-smart-pagination.change':
          this.dataSource.onPaginationChange(payload);
          break;
        case 'n7-smart-pagination.click':
          this.dataSource.onPaginationClick(payload);
          break;
        default:
          break;
      }
    });
  }
}
