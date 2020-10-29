import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { MrAdvancedSearchLayoutDS } from './advanced-search-layout.ds';

export class MrAdvancedSearchLayoutEH extends EventHandler {
  dataSource: MrAdvancedSearchLayoutDS;

  private destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-advanced-search-layout.init':
          this.dataSource.onInit(payload);
          this.listenFormChanges();
          break;

        case 'mr-advanced-search-layout.destroy':
          this.destroy$.next();
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-form-wrapper-accordion.submit':
          this.dataSource.onSubmit(payload);
          break;
        case 'mr-form-wrapper-accordion.reset':
          this.dataSource.onReset();
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
  }

  private listenFormChanges() {
    this.dataSource.form.changed$.subscribe(({ id, state }) => {
      // eslint-disable-next-line no-console
      console.log('changed$', { id, state });
    });
  }
}
