import { EventHandler } from '@net7/core';
import { MrImageViewerToolsDS } from '../data-sources/image-viewer-tools.ds';

export class MrImageViewerToolsEH extends EventHandler {
  dataSource: MrImageViewerToolsDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.click`:
          if (payload.thumbindex !== undefined) {
            const index = payload.thumbindex;
            this.dataSource.handleThumbs(index);
            this.emitOuter('thumbclick', index);
            break;
          }
          if (payload === 'close-description') {
            this.dataSource.toggleDescription();
            break;
          }
          if (payload === 'toggle-description') {
            this.dataSource.toggleDescription();
            break;
          }
          if (payload === 'toggle-thumbs') {
            this.dataSource.toggleThumbs();
            break;
          }
          if (payload === 'next') {
            // let index = this.dataSource.retrieveIndex();
            // this.dataSource.handleThumbsNext(index);
            // let updatedIndex = this.dataSource.retrieveIndex();
            // this.emitOuter('thumbclick', updatedIndex);
            this.dataSource.scrollRight();
            break;
          }
          if (payload === 'prev') {
            // let index = this.dataSource.retrieveIndex();
            // this.dataSource.handleThumbsPrev(index);
            // let updatedIndex = this.dataSource.retrieveIndex();
            // this.emitOuter('thumbclick', updatedIndex);
            this.dataSource.scrollLeft();
            break;
          }
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      // console.log(payload);
      switch (type) {
        case 'mr-resource-layout.init':
        case 'mr-resource-layout.thumbclick':
          // Silent
          break;
        case 'mr-resource-layout.pagechange':
          if (payload.targetId === this.dataSource.id) {
            this.dataSource.handlePageChange(payload.eventData);
          }
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
