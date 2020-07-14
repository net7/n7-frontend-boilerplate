import { EventHandler } from '@n7-frontend/core';
import { first, filter, withLatestFrom } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

export class AwTreeEH extends EventHandler {
  private targetOffset = new ReplaySubject();

  private targetIsOpen = false;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-tree.click':
          if (payload.source === 'toggle') {
            setTimeout(() => {
              this.dataSource.build(payload.id);
              if (this.targetIsOpen) {
                this.scrollOpenedIntoView();
              }
            });
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
          this.dataSource.out$
            .pipe(
              filter((data) => !!data),
              first()
            ).subscribe(() => {
              this.scrollLeafIntoView();
            });
          break;
        case 'aw-scheda-layout.treeposition': {
          const { target } = payload;
          const targetRect = target.getBoundingClientRect();
          this.targetIsOpen = target.className.indexOf('n7-icon-angle-right') !== -1;
          this.targetOffset.next(targetRect.top);
        } break;
        default:
          break;
      }
    });
  }

  private scrollOpenedIntoView = () => {
    this.dataSource.out$
      .pipe(
        filter((data) => !!data),
        first(),
        withLatestFrom(this.targetOffset),
      ).subscribe(([, offset]) => {
        setTimeout(() => {
          const wrapperEl = document.querySelector('.aw-scheda__tree-content') as HTMLElement;
          const expandedNode = document.getElementsByClassName('n7-tree__item is-expanded');
          const lastExpandedNode = expandedNode.length
            ? expandedNode[expandedNode.length - 1]
            : null;
          if (lastExpandedNode) {
            const scrollTreeEl = document.querySelector('.n7-tree') as HTMLElement;
            const wrapperElRect = wrapperEl.getBoundingClientRect();
            const offsetToAdjust = offset - wrapperElRect.top;
            scrollTreeEl.style.marginBottom = '1000px';
            lastExpandedNode.scrollIntoView();
            wrapperEl.scrollTop -= offsetToAdjust;
            window.scrollTo(0, 0);
            scrollTreeEl.style.marginBottom = '0px';
          }
        }, 200);
      });
  }

  private scrollLeafIntoView = () => {
    setTimeout(() => {
      const treeNode = document.querySelector('div.aw-scheda__tree');
      const leafNode = treeNode.querySelector('.is-active') as HTMLElement;
      if (leafNode && !this.isInViewport(leafNode)) {
        leafNode.scrollIntoView();
        window.scrollTo(0, 0);
        if (!this.isInViewport(leafNode)) {
          this.scrollLeafIntoView();
        }
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
