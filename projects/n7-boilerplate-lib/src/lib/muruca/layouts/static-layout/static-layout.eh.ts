import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs';
import { EventHandler } from '@n7-frontend/core';
import { takeUntil, switchMap } from 'rxjs/operators';
import { MrStaticLayoutDS } from './static-layout.ds';

export class MrStaticLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  public dataSource: MrStaticLayoutDS;

  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-static-layout.init':
          this.route = payload.route;
          this.dataSource.onInit(payload);

          // listen route
          this.listenRoute();
          break;

        case 'mr-static-layout.destroy':
          this.destroy$.next();
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
  }

  private listenRoute() {
    this.route.url.pipe(
      takeUntil(this.destroy$),
      switchMap((url: UrlSegment[]) => this.dataSource.pageRequest$(url[0].path))
    ).subscribe((response) => {
      this.dataSource.handleResponse(response);
    });
  }
}
