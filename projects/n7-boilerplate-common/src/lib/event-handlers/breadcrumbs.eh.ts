import { EventHandler } from '@net7/core';

export class BreadcrumbsEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'breadcrumbs.click':
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
