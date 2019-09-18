import { EventHandler } from '@n7-frontend/core';

export class AwHomeHeroPatrimonioEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-hero-patrimonio.click':
          this.emitGlobal('navigate', {
            handler: 'router',
            path: ['aw/patrimonio']
          });
          break;
        default:
          break;
      }
    });
    /*
    this.outerEvents$.subscribe(event => {
      
    });
    */
  }

}