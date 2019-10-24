import { EventHandler } from '@n7-frontend/core';

export class AwSearchLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-search-layout.init':
          this.dataSource.onInit(payload);
          console.log(type, payload);
          break;

        default:
          break;
      }
    });

    // listen to global events
    EventHandler.globalEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case 'global.queryparams':
          console.log('global', type, payload);
          this.emitOuter('queryparams', payload);
          break;

        default: 
          break;
      }
    });
  }

}