import { ActivatedRoute } from '@angular/router';
import { EventHandler } from '@n7-frontend/core';

export class AwCollectionLayoutEH extends EventHandler {
  private route: ActivatedRoute;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-collection-layout.init':
          this.dataSource.onInit(payload);
          this.route = payload.route;
          this.listenRoute();
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
  }

  listenRoute() {
    // get collection ID from the url
    this.route.paramMap.subscribe((params) => {
      if (params.get('id')) {
        this.dataSource.collectionID = params.get('id');
        this.dataSource.onCollectionID();
      }
    });
  }
}
