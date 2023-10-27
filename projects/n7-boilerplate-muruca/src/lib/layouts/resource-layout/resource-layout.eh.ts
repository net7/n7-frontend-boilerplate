import { EventHandler } from '@net7/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  takeUntil, switchMap, map, tap
} from 'rxjs/operators';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';
import { MrResourceModalService } from '../../services/resource-modal.service';

export class MrResourceLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  private router: Router;

  private layoutState: MrLayoutStateService;

  private modalService: MrResourceModalService;

  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-resource-layout.init': {
          this.route = payload.route;
          this.router = payload.router;
          this.modalService = payload.modalService;
          const { slug, id } = this.route.snapshot.params;
          const { url } = this.route.snapshot;
          this.dataSource.tab = url[url.length - 1].path;
          this.dataSource.slug = slug;
          this.dataSource.id = id;
          this.layoutState = payload.layoutState;
          this.dataSource.onInit(payload);
          this.listenRoute();
          // scroll top
          window.scrollTo(0, 0);

          // emit signal
          this.emitOuter('init');
        } break;
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
      if (type.indexOf('thumbclick') !== -1) {
        const [sourceId] = type.split('.');
        const targetId = sourceId.replace('-tools', '');
        this.emitOuter('thumbclick', {
          targetId,
          thumbindex: payload
        });
      }
      if (type.indexOf('pagechange') !== -1) {
        const [sourceId] = type.split('.');
        const targetId = `${sourceId}-tools`;
        this.emitOuter('pagechange', {
          targetId,
          eventData: payload
        });
      }
      // image viewer overlay events
      if (type.includes('overlayclick')) {
        this.emitOuter('showoverlaydetails', payload);
      }
      if (type.includes('overlaypagechange')) {
        this.emitOuter('hideoverlaydetails', payload);
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
        this.dataSource.id = id;
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
