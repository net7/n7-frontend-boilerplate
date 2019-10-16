import { EventHandler } from '@n7-frontend/core';

export class AwHomeAutocompleteEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case "aw-home-autocomplete.click":
          if(payload && payload.source === 'item') this.emitOuter('click', payload);
          break;
          
        default:
          break;
      }
    });
  }

}