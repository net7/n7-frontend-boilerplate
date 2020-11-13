import { EventHandler } from '@n7-frontend/core';

export class MrImageViewerToolsEH extends EventHandler {
  public listen() {
    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-resource-layout.pagechange':
          this.dataSource.handlePageChange(payload);
          break;
        case 'mr-resource-layout.init':
          // SILENT
          break;
        case 'mr-resource-layout.thumbclick':
          // SILENT
          break;
        default:
          // console.log(type, payload);
          break;
      }
    });
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'image-viewer-tools.click':
          this.handleClick(payload);
          break;
        default:
          // console.log(type, payload);
          break;
      }
    });
  }

  public handleClick(payload) {
    switch (payload) {
      case 'toggle-description':
        this.dataSource.toggleDescription();
        break;
      case 'toggle-thumbs':
        this.dataSource.toggleThumbnails();
        break;
      case 'close-description':
        this.dataSource.toolsData.isVisible.description = false;
        break;
      default:
        this.dataSource.changeDescription(payload.thumbindex);
        this.emitOuter('thumbclick', payload);
        break;
    }
  }
}
