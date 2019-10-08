import { EventHandler } from '@n7-frontend/core';

export class FacetsEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type){
        // TODO
        default:
          break;
      }
    });
  }
}