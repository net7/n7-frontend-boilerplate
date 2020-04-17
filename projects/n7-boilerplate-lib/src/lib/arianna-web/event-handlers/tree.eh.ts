import { EventHandler } from '@n7-frontend/core';

export class AwTreeEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-tree.click':
          if (payload.source === 'toggle') {
            this.dataSource.build(payload.id);
          }
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
        } break;
        case 'aw-scheda-layout.routechanged':
          // has output (not first load)
          if (this.dataSource.output) {
            this.dataSource.build(payload);
            this.dataSource.setActive(payload);
            this.dataSource.highlightActive();
            this.scrollLeafIntoView();
          } break;
        case 'aw-scheda-layout.viewleaf':
          this.dataSource.out$.subscribe(() => {
            this.scrollLeafIntoView();
          });
          break;
        default:
          break;
      }
    });
  }

  private scrollLeafIntoView = () => {
    const treeNode = document.querySelector('div.aw-scheda__tree');
    setTimeout(() => {
      const leafNode = treeNode.querySelector('.is-active');
      if (leafNode && !this.isInViewport(leafNode)) {
        leafNode.scrollIntoView();
        window.scrollTo(0, 0);
      }
    }, 200);
  };

  private isInViewport = (elem) => {
    const bounding = elem.getBoundingClientRect();
    return (
      bounding.top >= 0
      && bounding.left >= 0
      && bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
      && bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
  };
}
