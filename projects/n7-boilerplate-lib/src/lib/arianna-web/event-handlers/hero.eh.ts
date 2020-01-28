import { EventHandler } from '@n7-frontend/core';

export class AwHeroEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      console.log(type, payload);
      switch (type) {
        case 'aw-hero.click':
          if (payload === 'cerca' && this.dataSource.currentInputValue) {
            this.emitOuter('enter', this.dataSource.currentInputValue);
          }
          break;
        case 'aw-hero.change':
          this.dataSource.currentInputValue = payload;
          this.emitOuter('change', payload);
          break;
        case 'aw-hero.enter':
          this.emitOuter('enter', payload);
          break;

        default:
          console.log('(hero) unhandled event of type', type)
          break;
      }
    });
  }

}