import { EventHandler } from '@n7-frontend/core';

export class MrStaticLayoutEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-static-layout.init':
          this.dataSource.onInit(payload);
          this.fetchJson();
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });
    /*
      this.outerEvents$.subscribe(({ type, payload }) => {
      });
    */
  }

  private fetchJson() {
    this.dataSource.pageRequest$()
      .subscribe((response) => {
        const title = response.title.rendered;
        const content = response.content.rendered;
        this.dataSource.createHTML(title, content);
      });
  }
}
