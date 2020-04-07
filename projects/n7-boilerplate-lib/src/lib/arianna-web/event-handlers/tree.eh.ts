import { EventHandler } from '@n7-frontend/core';

export class AwTreeEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ payload }) => {
      switch (payload.source) {
        case 'toggle':
          this.dataSource.build(payload.id);
          break;
        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-sidebar-header.click':
          this.dataSource.toggleSidebar();
          break;
        case 'aw-scheda-layout.selectItem':
          this.dataSource.build(payload);
          break;
        case 'aw-scheda-layout.navigationresponse': {
          if (payload.currentItem) {
            this.dataSource.setActive(payload.currentItem);
          }
          const currentId = payload.currentItem || payload.tree.id;
          this.dataSource.load(payload);
          this.dataSource.build(currentId);

          const treeNode = document.querySelector('div.aw-scheda__tree');
          setTimeout(() => {
            const leafNode = treeNode.querySelector('.is-active');
            if (leafNode) leafNode.scrollIntoView(true);
            window.scrollTo(0, 0);
          });
        } break;
        case 'aw-scheda-layout.routechanged':
          // has output (not first load)
          if (this.dataSource.output) {
            this.dataSource.setActive(payload);
            this.dataSource.highlightActive();
          }
          break;
        default:
          break;
      }
    });
  }
}
