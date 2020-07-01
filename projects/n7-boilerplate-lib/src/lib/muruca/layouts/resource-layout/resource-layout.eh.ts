import { EventHandler } from '@n7-frontend/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import {
  takeUntil, switchMap, map, tap
} from 'rxjs/operators';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';

export class MrResourceLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  private layoutState: MrLayoutStateService;

  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-resource-layout.init':
          this.route = payload.route;
          this.layoutState = payload.layoutState;
          this.dataSource.onInit(payload);
          this.listenRoute();
          break;
        default:
          break;
      }
    });
  }

  private listenRoute() {
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      tap(() => {
        this.layoutState.set('content', LayoutState.LOADING);
      }),
      map((params: ParamMap) => params.get('slug')),
      switchMap((slug) => this.dataSource.pageRequest$(slug, (err) => {
        console.warn(`Error loading resource layout for ${slug}`, err.message);
        this.layoutState.set('content', LayoutState.ERROR);
      }))
    ).subscribe((response) => {
      this.layoutState.set('content', LayoutState.SUCCESS);
      this.dataSource.handleResponse(response);
    });
  }
}
