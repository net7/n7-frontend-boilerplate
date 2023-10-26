import { EventHandler } from '@net7/core';
import { filter, first } from 'rxjs/operators';
import { MrImageViewerDS } from '../data-sources/image-viewer.ds';

export class MrImageViewerEH extends EventHandler {
  layoutId: string;

  dataSource: MrImageViewerDS;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case `${this.dataSource.id}.click`:
          this.emitOuter('click', payload);
          break;
        case `${this.dataSource.id}.pagechange`:
          this.emitOuter('pagechange', payload);
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-resource-layout.init':
          this.listenToViewer();
          break;
        case 'mr-resource-layout.thumbclick':
          if (payload.targetId === this.dataSource.id) {
            this.dataSource.changePage(payload.thumbindex);
          }
          break;
        case 'mr-resource-layout.pagechange':
          // Silent
          break;
        case 'mr-resource-layout.hideoverlaydetails':
          this.dataSource.overlayEvents$.next({ type: 'resetselected' });
          // Silent
          break;
        default:
          // console.warn('unhandled event of type', type);
          break;
      }
    });
  }

  listenToViewer() {
    // loaded
    this.dataSource.viewerLoaded$.pipe(
      first()
    ).subscribe(() => {
      const { viewer } = this.dataSource;
      viewer.addHandler('page', (eventData) => {
        this.emitOuter('pagechange', eventData);
      });
    });

    this.dataSource.overlayEvents$.pipe(
      filter(({ type }) => type !== 'resetselected')
    ).subscribe(({ type, payload }) => {
      this.emitOuter(`overlay${type}`, {
        targetId: this.dataSource.id,
        ...payload
      });
    });
  }
}
