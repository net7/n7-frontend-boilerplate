import { EventHandler } from '@net7/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  takeUntil, switchMap, map, tap
} from 'rxjs/operators';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';
import { MrResourceModalService } from '../../services/resource-modal.service';
import { MrItineraryLayoutDS } from './itinerary-layout.ds';

export class MrItineraryLayoutEH extends EventHandler {
  public dataSource: MrItineraryLayoutDS;

  private route: ActivatedRoute;

  private router: Router;

  private layoutState: MrLayoutStateService;

  private modalService: MrResourceModalService;

  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-itinerary-layout.init':
          this.route = payload.route;
          this.router = payload.router;
          this.layoutState = payload.layoutState;
          this.modalService = payload.modalService;
          this.dataSource.onInit(payload);
          this.listenRoute();
          // scroll top
          window.scrollTo(0, 0);
          break;
        case 'mr-resource-layout.destroy':
          this.destroy$.next();
          break;
        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      if (type.indexOf('openresourcemodal') !== -1) {
        const { id, type: resourceType } = payload;
        this.modalService.open(id, resourceType);
      }
    });
  }

  private listenRoute() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.layoutState.set('content', LayoutState.LOADING);
      }),
      map((params: ParamMap) => params.get('id')),
      switchMap((id) => this.dataSource.pageRequest$(id, (err) => {
        if (err.status === 404) {
          // getting not found path
          const { config } = this.router;
          const route404 = config.find(({ data }) => data?.id === 'page-404');
          const path404 = route404?.path || 'page-404';
          this.router.navigate([path404]);
        }
        console.warn(`Error loading resource layout for ${id}`, err.message);
        this.layoutState.set('content', LayoutState.ERROR);
      }))
    ).subscribe((response) => {
      this.layoutState.set('content', LayoutState.SUCCESS);
      this.dataSource.handleResponse(response);
      // scroll top
      window.scrollTo(0, 0);
    });
  }
}
