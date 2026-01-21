import { EventHandler } from '@net7/core';

export class MrHeroEH extends EventHandler {
  inputPayload: '';

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.change`:
          console.warn(payload.inputPayload);
          if (payload.inputPayload && payload.inputPayload === 'input') {
            this.dataSource.currentInputValue = payload.value;
          }
          break;
        case `${this.dataSource.id}.click`:
          if (payload.payloadId === 'hero-search' && this.dataSource.currentInputValue) {
            this.emitOuter('hero-search-enter', { inputValue: this.dataSource.currentInputValue, route: payload.route });
          }
          break;
        default:
          break;
      }
    });
  }
}
