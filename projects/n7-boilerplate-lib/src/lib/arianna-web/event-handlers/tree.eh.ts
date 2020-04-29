import { EventHandler } from '@n7-frontend/core';
import { first, filter, withLatestFrom } from 'rxjs/operators';
import { ReplaySubject } from 'rxjs';

export class AwTreeEH extends EventHandler {
  private scrollOffset = 0;

  private currentExpH = 0;

  private targetOffset = new ReplaySubject()

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-tree.click':
          if (payload.source === 'toggle') {
            setTimeout(() => {
              this.dataSource.build(payload.id);
              this.scrollOpenedIntoView();
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
          this.targetOffset.next(payload.target.getBoundingClientRect().top);
          const expandedNode = document.getElementsByClassName('n7-tree__item is-expanded');
          const lastExpandedNode = expandedNode.length
            ? expandedNode[0]
            : null;
          // const scroller = document.querySelector('.aw-scheda__tree-content');
          if (lastExpandedNode) {
            const expandedHeight = lastExpandedNode.querySelector('.n7-tree__children-wrapper').clientHeight;
            this.scrollOffset = (lastExpandedNode as HTMLElement).getBoundingClientRect().top;
            // (lastExpandedNode as HTMLElement).offsetTop
            //   - scroller.scrollTop
            //   + this.currentExpH;
            // this.scrollOffset = payload.target.offsetTop - scroller.scrollTop;
            // console.log({
            //   payload,
            //   // 'payload-target': payload.target,
            //   height: this.currentExpH,
            //   target: lastExpandedNode,
            //   offset: (lastExpandedNode as HTMLElement).offsetTop,
            //   parentScroll: scroller.scrollTop,
            //   calculated: this.scrollOffset,
            //   rect: (lastExpandedNode as HTMLElement).getBoundingClientRect(),
            // });
            this.currentExpH = expandedHeight;
          }
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
          // console.log({ offset });
          const expandedNode = document.getElementsByClassName('n7-tree__item is-expanded');
          const lastExpandedNode = expandedNode.length
            ? expandedNode[expandedNode.length - 1]
            : null;
          if (lastExpandedNode) {
            lastExpandedNode.scrollIntoView();
            window.scrollTo(0, 0);
            document.querySelector('.aw-scheda__tree-content').scrollTop -= offset;
          }
        }, 500);
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
