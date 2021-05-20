import { EventHandler } from '@n7-frontend/core';

export class AwSidebarHeaderEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (type === 'aw-sidebar-header.click') {
        this.emitOuter('click', payload);
      }
    });
  }
}
