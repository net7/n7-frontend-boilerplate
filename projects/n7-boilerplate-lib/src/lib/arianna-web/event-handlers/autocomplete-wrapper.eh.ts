import { EventHandler } from '@n7-frontend/core';

export class AwAutocompleteWrapperEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({type, payload}) => {
      switch(type) {
        // case 'your-event.click':
        //   // do something
        //   break;
        default:
          console.warn('unhandled event of type:', type)
          break;
      }
    });
  }

}