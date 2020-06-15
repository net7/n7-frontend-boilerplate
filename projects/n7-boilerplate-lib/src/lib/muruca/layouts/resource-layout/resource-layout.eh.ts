import { EventHandler } from '@n7-frontend/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, switchMap, map } from 'rxjs/operators';

export class MrResourceLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-resource-layout.init':
          this.route = payload.route;
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
      map((params: ParamMap) => ({
        type: params.get('type'),
        id: params.get('id')
      })),
      switchMap(({ id, type }) => this.dataSource.pageRequest$({ type, id }))
    ).subscribe((response) => {
      this.dataSource.initSections(response);
    });
  }
}
