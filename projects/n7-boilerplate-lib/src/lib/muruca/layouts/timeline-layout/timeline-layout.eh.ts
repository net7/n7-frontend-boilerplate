import { EventHandler } from '@n7-frontend/core';

export class MrTimelineLayoutEH extends EventHandler {
  private route: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-timeline-layout.init':
          this.dataSource.onInit(payload);
          this.route = payload.route;
          this.listenRoute();
          break;
        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
    this.outerEvents$.subscribe(({ type }) => {
      switch (type) {
        default:
          break;
      }
    });
  }

  private listenRoute() {
    this.route.paramMap.subscribe((params) => {
      const paramId = params.get('id');
      if (paramId) {
        if (paramId) {
          this.dataSource.currentId = paramId;
          this.emitOuter('routechanged', paramId);
          this.dataSource.updatePageDetails(paramId);
        }
      }
    });
  }
}
