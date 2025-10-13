import { EventHandler } from '@net7/core';
import { MrParallelTextViewerDS } from '../data-sources/parallel-text-viewer.ds';

export class MrParallelTextViewerEH extends EventHandler {
  layoutId: string;

  dataSource: MrParallelTextViewerDS;

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
