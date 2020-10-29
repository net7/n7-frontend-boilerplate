import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class MrAdvancedSearchLayoutEH extends EventHandler {
  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-advanced-search-layout.init':
          this.dataSource.onInit(payload);
          break;

        case 'mr-advanced-search-layout.destroy':
          this.destroy$.next();
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
  }
}
