import { ActivatedRoute } from '@angular/router';
import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MrAdvancedResultsLayoutDS } from './advanced-results-layout.ds';

export class MrAdvancedResultsLayoutEH extends EventHandler {
  protected activatedRoute: ActivatedRoute;

  protected destroy$: Subject<void> = new Subject();

  dataSource: MrAdvancedResultsLayoutDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-advanced-results-layout.init':
          this.activatedRoute = payload.activatedRoute;
          this.dataSource.onInit(payload);

          // listen route changes
          this.listenToRouterChanges();
          break;

        case 'mr-advanced-results-layout.destroy':
          this.destroy$.next();
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });

    // this.outerEvents$.subscribe(({ type, payload }) => {
    //   switch (type) {
    //     default:
    //       console.warn('unhandled inner event of type', type);
    //       break;
    //   }
    // });
  }

  /** URL changes */
  protected listenToRouterChanges() {
    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroy$),
    ).subscribe((params) => {
      this.dataSource.request$(params).subscribe((response) => {
        this.dataSource.updateResults(response);
      });
    });
  }
}
