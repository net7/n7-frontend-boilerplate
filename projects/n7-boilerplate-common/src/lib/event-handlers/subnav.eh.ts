import { EventHandler } from '@net7/core';

export class SubnavEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'subnav.click':
          // navigate control
          if (payload.source === 'navigate') {
            this.emitGlobal('navigate', payload);
          }

          // global signal
          this.emitGlobal(type, payload);
          break;

        default:
          break;
      }
    });
  }
}
