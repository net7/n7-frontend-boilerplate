import { EventHandler } from '@n7-frontend/core';

export class AwAutocompleteWrapperEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-autocomplete-wrapper.click':
          this.emitOuter('clickresult', payload)
          break;
        default:
          console.warn('unhandled event of type:', type)
          break;
      }
    });
  }

}