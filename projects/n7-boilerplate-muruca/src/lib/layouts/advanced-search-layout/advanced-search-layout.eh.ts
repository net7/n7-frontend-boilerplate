import { EventHandler } from '@net7/core';
import { Subject } from 'rxjs';
import { MrAdvancedSearchLayoutDS } from './advanced-search-layout.ds';

export class MrAdvancedSearchLayoutEH extends EventHandler {
  dataSource: MrAdvancedSearchLayoutDS;

  protected destroy$: Subject<void> = new Subject();

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-advanced-search-layout.init':
          this.dataSource.onInit(payload);
          // init hook
          this.onInit();
          // scroll top
          window.scrollTo(0, 0);
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

  /**
   * @example
   * protected onInit() {
   *   this.dataSource.form.changed$.subscribe(({ id, state }) => {
   *     console.log('changed$', { id, state });
   *   });
   * }
   */
  protected onInit() {
    // to be extended on project
  }
}
