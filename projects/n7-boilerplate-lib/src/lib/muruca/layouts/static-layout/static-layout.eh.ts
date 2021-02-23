import { ActivatedRoute, Router, UrlSegment } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { EventHandler } from '@n7-frontend/core';
import { takeUntil, switchMap, tap } from 'rxjs/operators';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';
import { MrStaticLayoutDS } from './static-layout.ds';

export class MrStaticLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  private router: Router;

  public dataSource: MrStaticLayoutDS;

  private layoutState: MrLayoutStateService;

  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-static-layout.init':
          this.route = payload.route;
          this.router = payload.router;
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
      switchMap((urlSegments: UrlSegment[]) => this.dataSource.pageRequest$(
        urlSegments,
        (err: HttpErrorResponse) => {
          if (err.status === 404) {
            // getting not found path
            const { config } = this.router;
            const route404 = config.find(({ data }) => data?.id === 'page-404');
            const path404 = route404?.path || 'page-404';
            this.router.navigate([path404]);
          }
          console.warn(`Error loading static layout for ${urlSegments}`, err.message);
          this.layoutState.set('content', LayoutState.ERROR);
        }
      ))
    ).subscribe((response) => {
      this.layoutState.set('content', LayoutState.SUCCESS);
      this.dataSource.handleResponse(response);
    });
  }
}
