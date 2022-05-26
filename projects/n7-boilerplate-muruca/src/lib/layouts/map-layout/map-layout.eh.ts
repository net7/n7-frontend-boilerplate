import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { EventHandler } from '@net7/core';
import { MrLocaleService } from '../../services/locale.service';
import { MrMapLayoutDS } from './map-layout.ds';

export class MrMapLayoutEH extends EventHandler {
  dataSource: MrMapLayoutDS;

  private route: ActivatedRoute;

  private router: Router;

  private localeService: MrLocaleService;

  private location: Location;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-map-layout.init':
          this.dataSource.onInit(payload);
          this.route = payload.route;
          this.router = payload.router;
          this.localeService = payload.localeService;
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
                  const href = this.localeService.getLinkByRouteId('mapItem', marker.id, marker.slug);
                  this.location.go(href);
                  this.dataSource.updatePageDetails(marker.id);
                } else {
                  const href = this.localeService.getLinkByRouteId('map');
                  this.location.go(href);
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

          // emit signal
          this.emitOuter('routechanged', null);
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
        this.dataSource.updatePageDetails(paramId);

        // emit signal
        this.emitOuter('routechanged', paramId);
      } else {
        this.dataSource.loadDefaults(true);
      }
    });
  }
}
