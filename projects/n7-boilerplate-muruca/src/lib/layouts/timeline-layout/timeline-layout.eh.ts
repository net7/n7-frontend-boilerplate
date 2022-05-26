import { ActivatedRoute, Router } from '@angular/router';
import { EventHandler } from '@net7/core';
import { Timeline } from 'vis-timeline';
import { helpers } from '@net7/boilerplate-common';
import { Location } from '@angular/common';
import { MrResourceModalService } from '../../services/resource-modal.service';
import { MrLocaleService } from '../../services/locale.service';

export class MrTimelineLayoutEH extends EventHandler {
  private modalService: MrResourceModalService;

  private route: ActivatedRoute;

  private router: Router;

  private localeService: MrLocaleService;

  private location: Location;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-timeline-layout.init':
          this.dataSource.onInit(payload);
          this.modalService = payload.modalService;
          this.route = payload.route;
          this.router = payload.router;
          this.localeService = payload.localeService;
          this.location = payload.location;
          this.listenRoute();
          // scroll top
          window.scrollTo(0, 0);

          this.dataSource.timelineListener$.subscribe((timeline: Timeline) => {
            timeline.on('click', (props) => {
              if (!props.item) return;
              // build URL slug
              const { content } = this.dataSource.timelineData.dataSet
                .find((d: { id: number; content: string }) => d.id === props.item);
              const slug = helpers.slugify(content);
              // navigate without reloading the layout
              const href = this.localeService.getLinkByRouteId('timelineItem', props.item, slug);
              this.location.go(href);
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

  public itemPreviewEmit = (type, payload) => {
    if (type === 'click' && payload?.action === 'resource-modal') {
      const { id, type: resourceType } = payload;
      this.modalService.open(id, resourceType);
    }
  };
}
