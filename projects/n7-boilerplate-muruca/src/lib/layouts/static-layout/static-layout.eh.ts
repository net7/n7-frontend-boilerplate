import {
  ActivatedRoute, Data, Params, Router, UrlSegment
} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Subject } from 'rxjs';
import { EventHandler } from '@net7/core';
import {
  takeUntil, switchMap, tap, map, distinctUntilChanged
} from 'rxjs/operators';
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
          // scroll top
          window.scrollTo(0, 0);
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
      // ignore navigations that only change the fragment (e.g. clicking an
      // in-page anchor): the router re-emits `url` on every navigation, even
      // when the page itself hasn't changed, which would otherwise re-fetch
      // the same content and reset the layout state needlessly
      distinctUntilChanged((prev: UrlSegment[], curr: UrlSegment[]) => (
        prev.map((s) => s.path).join('/') === curr.map((s) => s.path).join('/')
      )),
      map((urlSegments: UrlSegment[]) => ({
        urlSegments,
        routerParams: this.route.snapshot.params,
        routerData: this.route.snapshot.data,
      })),
      tap(() => {
        this.layoutState.set('content', LayoutState.LOADING);
      }),
      switchMap((
        { urlSegments, routerParams, routerData }:
        { urlSegments: UrlSegment[]; routerParams: Params; routerData: Data }
      ) => this.dataSource.pageRequest$({
        urlSegments,
        routerParams,
        onError: (err: HttpErrorResponse) => {
          if (err.status === 404) {
            // getting not found path
            const { config } = this.router;
            let route404 = config.find(({ data }) => data?.id === 'page-404' && data.locale === routerData.locale);
            if (!route404) {
              route404 = config.find(({ data }) => data?.id === 'page-404');
            }
            const path404 = route404?.path || 'page-404';
            this.router.navigate([path404]);
          } else {
            console.warn(`Error loading static layout for ${urlSegments}`, err.message);
            this.layoutState.set('content', LayoutState.ERROR);
          }
        }
      }))
    ).subscribe((response) => {
      this.layoutState.set('content', LayoutState.SUCCESS);
      this.dataSource.handleResponse(response);
    });
  }
}
