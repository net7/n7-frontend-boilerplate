import { EventHandler } from '@n7-frontend/core';

export class AwHeroEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-hero.click':
          // TODO
          break;

        case 'aw-hero.change':
          this.emitOuter('change', payload);
          break;

        default:
          break;
      }
    });
  }

}