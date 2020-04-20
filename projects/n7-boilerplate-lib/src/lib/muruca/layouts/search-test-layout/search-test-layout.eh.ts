import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class SearchTestLayoutEH extends EventHandler {
  private destroyed$: Subject<boolean> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-test-layout.init':
          this.dataSource.onInit(payload);
          this.listenToFacetsChange(payload.emit$);
          break;

        case 'mr-search-test-layout.destroy':
          this.destroyed$.next(true);
          break;
        default:
          break;
      }
    });
  }

  listenToFacetsChange(emit$) {
    emit$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({ type, payload }) => {
      console.warn(type, payload);
    });
  }
}
