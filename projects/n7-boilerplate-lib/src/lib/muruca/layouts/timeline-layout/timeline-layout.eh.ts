import { ActivatedRoute } from '@angular/router';
import { EventHandler } from '@n7-frontend/core';
import * as vis from 'vis-timeline';

export class MrTimelineLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-timeline-layout.init':
          this.dataSource.onInit(payload);
          this.route = payload.route;
          this.listenRoute();

          this.dataSource.timelineListener$.subscribe((timeline: vis.Timeline) => {
            timeline.on('click', (props) => {
              if (!props.item) return;
              this.emitGlobal('navigate', {
                handler: 'router',
                path: [`/timeline/${props.item}/evento`]
              });
            });
          });
          // (this.dataSource.timelineInstance as vis.Timeline).on('click', (properties) => {
          //   console.log(properties);
          // });
          break;
        case 'mr-timeline-layout.destroy':
          break;
        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
    this.outerEvents$.subscribe(({ type }) => {
      switch (type) {
        default:
          break;
      }
    });
  }

  private listenRoute() {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');
      if (paramId) {
        if (paramId) {
          this.dataSource.currentId = paramId;
          this.emitOuter('routechanged', paramId);
          this.dataSource.updatePageDetails(paramId);
        }
      }
    });
  }
}
