import { EventHandler } from '@n7-frontend/core';

export class AwTreeEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload, $event }) => {
      console.log(this);
      //console.log(payload);
      switch (payload) {
        case 'toggle':
          this.dataSource.toggleNav();
          // TODO
          break;

       /* case 'aw-hero.change':
          this.emitOuter('change', payload);
          break;*/

        default:
          break;
      }
    });
    /* this.outerEvents$.subscribe(event => {
    
    }); */
  }

}