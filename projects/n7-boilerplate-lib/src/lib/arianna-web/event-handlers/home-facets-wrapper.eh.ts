import { EventHandler } from '@n7-frontend/core';

export class AwHomeFacetsWrapperEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        default:
          break;
      }
    });
    /* this.outerEvents$.subscribe(event => {
    
    }); */
  }

}