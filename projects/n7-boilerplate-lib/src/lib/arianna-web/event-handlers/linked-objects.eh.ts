import { EventHandler } from '@n7-frontend/core';

export class AwLinkedObjectsEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-linked-objects.click':
          // navigate to the patrimonio page of this item
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/patrimonio/${payload}`]
          });
          break;
        default:
          console.warn('unhandled event type: ', type, ' with payload: ', payload)
          break;
      }
    });
  }
}