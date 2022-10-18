import { EventHandler } from '@net7/core';
import { MrTextViewerDS } from '../data-sources/text-viewer.ds';

export class MrTextViewerEH extends EventHandler {
  layoutId: string;

  dataSource: MrTextViewerDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.hostId}.click`:
          this.dataSource.onClick(payload);
          break;
        case `${this.hostId}.togglecolumn`:
          this.dataSource.displayIndex();
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });
  }
}
