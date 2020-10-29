import { EventHandler } from '@n7-frontend/core';

export class MrFormWrapperAccordionEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-form-wrapper-accordion.submit':
        case 'mr-form-wrapper-accordion.reset':
        case 'mr-form-wrapper-accordion.click':
          console.log('inner events$', type, payload);
          break;
        default:
          break;
      }
    });
  }
}
