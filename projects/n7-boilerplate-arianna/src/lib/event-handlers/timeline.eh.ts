import { EventHandler } from '@net7/core';
import { first } from 'rxjs/operators';

export class AwTimelineEH extends EventHandler {
  public listen() {
    this.outerEvents$.subscribe(({ type }) => {
      switch (type) {
        case 'aw-timeline-layout.init':
          this.listenToTimeline();
          break;

        case 'aw-timeline-layout.zoomout':
          this.dataSource.timeline.zoomOut(0.7);
          break;

        case 'aw-timeline-layout.zoomin':
          this.dataSource.timeline.zoomIn(0.7);
          break;

        default:
          break;
      }
    });
  }

  private listenToTimeline() {
    this.dataSource.timelineLoaded$
      .pipe(
        first()
      )
      .subscribe(() => {
        const { timeline, dataSet } = this.dataSource;
        timeline.on('click', ({ item }) => {
          const clicked = dataSet.find(({ id }) => item === id);
          if (clicked) {
            const { dateText } = clicked._meta;
            const { id, label } = clicked.item;
            this.emitOuter('click', {
              id,
              label,
              dateText,
            });
          } else {
            this.emitOuter('click', {
              id: null
            });
          }
        });
      });
  }
}
