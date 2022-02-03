import { EventHandler } from '@n7-frontend/core';
import { fromEvent, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { MrFormWrapperAccordionDS } from '../data-sources';

export class MrFormWrapperAccordionEH extends EventHandler {
  private destroy$: Subject<void> = new Subject();

  dataSource: MrFormWrapperAccordionDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-form-wrapper-accordion.init':
          this.listenKeyUpEvents();
          break;
        case 'mr-form-wrapper-accordion.destroy':
          this.destroy$.next();
          break;
        case 'mr-form-wrapper-accordion.submit': {
          const { form } = this.dataSource.output;
          this.emitOuter('submit', {
            state: form.getState()
          });
          break;
        }
        case 'mr-form-wrapper-accordion.reset':
          this.emitOuter('reset');
          break;
        case 'mr-form-wrapper-accordion.click':
          this.dataSource.toggleGroup(payload);
          break;
        default:
          break;
      }
    });
  }

  private listenKeyUpEvents() {
    const keyup$ = fromEvent(window, 'keyup');

    keyup$.pipe(
      filter((event: KeyboardEvent) => event.key === 'Enter'),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.emitInner('submit');
    });
  }
}
