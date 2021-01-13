import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventHandler } from '@n7-frontend/core';
import * as vis from 'vis-timeline';

export class MrTimelineLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  private router: Router;

  private location: Location;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-timeline-layout.init':
          this.dataSource.onInit(payload);
          this.route = payload.route;
          this.router = payload.router;
          this.location = payload.location;
          this.listenRoute();

          this.dataSource.timelineListener$.subscribe((timeline: vis.Timeline) => {
            timeline.on('click', (props) => {
              if (!props.item) return;
              // navigate without reloading the layout
              this.location.go(`/timeline/${props.item}/evento`);
              this.dataSource.updatePageDetails(props.item);
            });
          });
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
        case 'mr-year-header.closeevent':
          this.dataSource.loadDefaults();
          break;
        default:
          break;
      }
    });
  }

  private listenRoute() {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');
      // setTimeout(() => {
      //   // const url = this.router.createUrlTree([], { relativeTo: this.route }).toString();
      //   this.location.go('/timeline/');
      // }, 5000);
      if (paramId) {
        this.dataSource.currentId = paramId;
        this.emitOuter('routechanged', paramId);
        this.dataSource.updatePageDetails(paramId);
      }
    });
  }
}
