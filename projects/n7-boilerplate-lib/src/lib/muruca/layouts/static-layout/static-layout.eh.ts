import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subject } from 'rxjs';
import { EventHandler } from '@n7-frontend/core';
import { takeUntil, switchMap, map } from 'rxjs/operators';
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
    this.route.paramMap.pipe(
      takeUntil(this.destroy$),
      map((params: ParamMap) => params.get('slug')),
      switchMap((slug: string) => this.dataSource.pageRequest$(slug))
    ).subscribe((response) => {
      const { title } = response;
      const { body } = response;
      this.dataSource.renderHTML(title, body);
    });
  }
}
