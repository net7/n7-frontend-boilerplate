import { EventHandler } from '@net7/core';

export class AwSidebarHeaderEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (type === 'aw-sidebar-header.click') {
        this.emitOuter('click', payload);
      }
    });
  }
}
