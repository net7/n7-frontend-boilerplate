import { EventHandler } from '@n7-frontend/core';
import { first } from 'rxjs/operators';

export class MrImageViewerEH extends EventHandler {
  public listen() {
    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-resource-layout.init':
          this.listenToViewer();
          break;
        case 'mr-resource-layout.thumbclick':
          this.dataSource.handleThumbClick(payload);
          break;
        case 'mr-resource-layout.pagechange':
          // SILENT
          break;
        default:
          // console.log(type, payload);
          break;
      }
    });
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'image-viewer.pagechange':
          // SILENT
          break;
        default:
          console.warn(`unused ${type}with payload:`, payload);
          break;
      }
    });
  }

  listenToViewer() {
    this.dataSource.viewerLoaded$.pipe(
      first()
    ).subscribe(() => {
      const { viewer } = this.dataSource;
      viewer.addHandler('page', (eventData) => {
        this.emitInner('pagechange', eventData);
        this.emitOuter('pagechange', eventData);
      });
    });
  }
}
