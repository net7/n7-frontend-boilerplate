import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventHandler } from '@n7-frontend/core';
import * as vis from 'vis-timeline';
import helpers from '../../../common/helpers';

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
              // build URL slug
              const { content } = this.dataSource.timelineData.dataSet
                .find((d: { id: number; content: string }) => d.id === props.item);
              const slug = helpers.slugify(content);
              // navigate without reloading the layout
              this.location.go(`/timeline/${props.item}/${slug}`);
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
          this.dataSource.loadDefaults(true);
          break;
        default:
          break;
      }
    });
  }

  private listenRoute() {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');
      if (paramId) {
        this.dataSource.currentId = paramId;
        this.emitOuter('routechanged', paramId);
        this.dataSource.updatePageDetails(paramId);
      } else {
        this.dataSource.loadDefaults(true);
      }
    });
  }
}
