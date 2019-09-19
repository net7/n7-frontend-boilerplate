import { EventHandler } from '@n7-frontend/core';

export class AwHomeFacetsWrapperEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-facets-wrapper.click':
          this.emitOuter('click',payload);
          break;
        default:
          break;
      }
    });
    /* this.outerEvents$.subscribe(event => {
    
    }); */
  }

}