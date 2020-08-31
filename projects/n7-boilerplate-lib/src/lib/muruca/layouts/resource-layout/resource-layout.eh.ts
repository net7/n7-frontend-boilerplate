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
        case 'mr-resource-layout.init': {
          this.route = payload.route;
          const { slug, id } = this.route.snapshot.params;
          const { url } = this.route.snapshot;
          this.dataSource.tab = url[url.length - 1].path;
          this.dataSource.slug = slug;
          this.dataSource.id = id;
          this.layoutState = payload.layoutState;
          this.dataSource.onInit(payload);
          this.listenRoute();
        } break;
        case 'mr-resource-layout.destroy':
          this.destroy$.next();
          break;
        default:
          console.warn('unhandled inner event of type', type);
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
      map((params: ParamMap) => params.get('id')),
      switchMap((id) => this.dataSource.pageRequest$(id, (err) => {
        console.warn(`Error loading resource layout for ${id}`, err.message);
        this.dataSource.id = id;
        this.layoutState.set('content', LayoutState.ERROR);
      }))
    ).subscribe((response) => {
      this.layoutState.set('content', LayoutState.SUCCESS);
      this.dataSource.handleResponse(response);
    });
  }
}
