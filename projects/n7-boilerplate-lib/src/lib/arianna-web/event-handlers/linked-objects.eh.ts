import { EventHandler } from '@n7-frontend/core';

export class AwLinkedObjectsEH extends EventHandler {

  public listen() {

    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-linked-objects.click':
          if (payload.startsWith('page')) {
            // pagination routing is handled by the parent layout
            this.emitOuter('pagination', payload)
          } else if (payload.startsWith('goto')) {
            let targetPage = Number(payload.replace('goto-', ''))
            // kill impossible page navigations
            if ( targetPage > this.dataSource.totalPages ) return;
            else if ( targetPage < 1 || targetPage === this.dataSource.currentPage ) return;
            else this.emitOuter('goto', payload)
          } else {
            // navigate to the patrimonio page of this item
            this.emitGlobal('navigate', {
              handler: 'router',
              path: [`aw/patrimonio/${payload}`]
            });
          }
          break;
        case 'aw-linked-objects.change':
          this.emitOuter('change', Number(payload.value))
          break;
          default:
            console.warn('unhandled event type: ', type, ' with payload: ', payload)
            break;
      }
    });
  }
}