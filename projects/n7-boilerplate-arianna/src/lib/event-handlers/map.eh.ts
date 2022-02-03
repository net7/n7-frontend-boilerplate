import { EventHandler } from '@n7-frontend/core';

export class AwMapEH extends EventHandler {
  public listen() {
    this.outerEvents$.subscribe(({ type }) => {
      switch (type) {
        case 'aw-map-layout.init':
          this.listenToMarkers();
          break;

        default:
          break;
      }
    });
  }

  private listenToMarkers() {
    this.dataSource.markerOpen$.subscribe((item) => {
      this.emitOuter('markeropen', item);
    });

    this.dataSource.markerClose$.subscribe(() => {
      this.emitOuter('markerclose');
    });
  }
}
