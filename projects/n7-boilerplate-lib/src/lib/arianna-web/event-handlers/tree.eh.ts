import { EventHandler } from '@n7-frontend/core';

export class AwTreeEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (payload.source) {
        case 'toggle':
          this.dataSource.build(payload.id);
          break;
        case 'menuitem':
          this.dataSource.setActive(payload.id);
          this.dataSource.highlightActive();
          this.emitOuter('click', payload);
          break;
        default:
          break;
      }
    });

     this.outerEvents$.subscribe(({ type, payload }) => {
        switch ( type ) {
          case 'aw-sidebar-header.click':
            this.dataSource.toggleSidebar();
            break;
          case 'aw-scheda-layout.selectItem':
            this.dataSource.build(payload);
            break;
          case 'aw-scheda-layout.navigationresponse':
            if (payload.currentItem) {
              this.dataSource.setActive(payload.currentItem);
            }
            const currentId = payload.currentItem || payload.tree.id;
            this.dataSource.load(payload);
            this.dataSource.build(currentId);
            break;
          }
      });
  }

}