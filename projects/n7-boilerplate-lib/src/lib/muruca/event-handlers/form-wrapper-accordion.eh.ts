import { EventHandler } from '@n7-frontend/core';
import { MrFormWrapperAccordionDS } from '../data-sources';

export class MrFormWrapperAccordionEH extends EventHandler {
  dataSource: MrFormWrapperAccordionDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
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
}
