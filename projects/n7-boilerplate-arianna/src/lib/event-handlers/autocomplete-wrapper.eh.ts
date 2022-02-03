import { EventHandler } from '@n7-frontend/core';

export class AwAutocompleteWrapperEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-autocomplete-wrapper.click':
          if (payload !== 'fallback-simple-autocomplete') { // if this is the fallback item, kill the event.
            this.emitOuter('clickresult', payload);
          }
          break;
        default:
          console.warn('unhandled event of type:', type);
          break;
      }
    });
  }
}
