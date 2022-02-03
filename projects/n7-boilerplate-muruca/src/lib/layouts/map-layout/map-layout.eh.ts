import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { EventHandler } from '@n7-frontend/core';

export class MrMapLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  private router: Router;

  private location: Location;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-map-layout.init':
          this.dataSource.onInit(payload);
          this.route = payload.route;
          this.router = payload.router;
          this.location = payload.location;
          this.listenRoute();
          // scroll top
          window.scrollTo(0, 0);

          // listen for clicks on the map markers
          this.dataSource.mapListener$
            .subscribe(({ markers }) => {
              markers.on('click', ({ layer: marker }) => {
                if (!marker.id) return;
                const isSelected = marker.getIcon().options.className.includes('selected');
                if (isSelected) {
                  // navigate to the clicked resource / marker
                  this.location.go(`/map/${marker.id}/${marker.slug}`);
                  this.dataSource.updatePageDetails(marker.id);
                } else {
                  this.location.go('/map/');
                  this.dataSource.loadDefaults();
                }
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
