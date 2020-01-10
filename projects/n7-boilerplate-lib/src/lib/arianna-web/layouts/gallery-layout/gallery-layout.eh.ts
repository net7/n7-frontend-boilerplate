import { EventHandler } from '@n7-frontend/core';

export class AwGalleryLayoutEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-gallery-layout.init':
          this.dataSource.onInit(payload);
      }
    });

    /* this.outerEvents$.subscribe(({ type, payload }) => {
      
    }); */
  }

}