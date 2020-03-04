import { EventHandler } from '@n7-frontend/core';

export class AwSchedaSidebarEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      if (type === 'aw-sidebar-header.click') {
        this.dataSource.toggleSidebar();
        this.emitOuter(type, payload);
      }
    });
  }
}
