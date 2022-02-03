import { EventHandler } from '@n7-frontend/core';

export class AwLinkedObjectsEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-linked-objects.change': // changed page size value (pagination)
          this.emitOuter('change', +payload.value);
          break;
        default:
          console.warn('unhandled event type: ', type, ' with payload: ', payload);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-layout.viewmore':
          // ask home-layout for more data
          this.dataSource.checkForMore(false);
          this.emitOuter('datarequest', {
            currentPage: this.dataSource.currentPage,
          });
          break;
        case 'aw-home-layout.dataresponse': {
          // handle incoming data from home-layout
          const { res } = payload;
          this.dataSource.handleIncomingData(res);
        } break;
        case 'aw-home-layout.scroll':
          this.handleScroll(payload);
          break;
        default:
          break;
      }
    });
  }

  public handleScroll = (target) => {
    const { totalObjects, loadedData } = this.dataSource;
    const loadedTotal = Array.isArray(loadedData.result) ? loadedData.result.length : 0;

    if (loadedTotal >= totalObjects) {
      return;
    }
    /*
      Check if the target element is scrolled near the end while data is not already loading.
      If the condition is met, a request for more data is sent.
    */
    if (
      target.scrollTop + target.clientHeight >= target.scrollHeight - 150
      && this.dataSource.loadedData.isLoading === false
    ) {
      this.dataSource.loadedData.isLoading = true;
      this.emitOuter('datarequest', {
        currentPage: this.dataSource.currentPage,
      });
    }
  }
}
