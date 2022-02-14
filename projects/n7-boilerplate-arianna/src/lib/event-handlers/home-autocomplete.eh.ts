import { EventHandler } from '@net7/core';

export class AwHomeAutocompleteEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-autocomplete.click':
          this.emitOuter('click', payload);
          break;

        default:
          break;
      }
    });
  }
}
