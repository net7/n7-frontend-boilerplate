import { ActivatedRoute, UrlSegment } from '@angular/router';
import { Subject } from 'rxjs';
import { EventHandler } from '@n7-frontend/core';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';
import { MrStaticLayoutDS } from './static-layout.ds';

export class MrStaticLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  public dataSource: MrStaticLayoutDS;

  private layoutState: MrLayoutStateService;

  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-static-layout.init':
          this.route = payload.route;
          this.layoutState = payload.layoutState;
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
      tap(() => {
        this.layoutState.set('content', LayoutState.LOADING);
      }),
      switchMap((url: UrlSegment[]) => this.dataSource.pageRequest$(url, (err) => {
        console.warn(`Error loading static layout for ${url}`, err.message);
        this.layoutState.set('content', LayoutState.ERROR);
      }))
    ).subscribe((response) => {
      this.layoutState.set('content', LayoutState.SUCCESS);
      this.dataSource.handleResponse(response);
    });
  }
}
