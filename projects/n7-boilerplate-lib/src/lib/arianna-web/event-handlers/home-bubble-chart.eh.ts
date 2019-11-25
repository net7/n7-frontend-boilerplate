import { EventHandler } from '@n7-frontend/core';

export class AwHomeBubbleChartEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(event => {
      switch (event.type) {
        case 'aw-home-bubble-chart.click':
          this.emitOuter('click',event.payload);
          break;
        case 'aw-home-bubble-chart.mouseenter':
          this.emitOuter('mouseenter',event.payload);
          break;
        case 'aw-home-bubble-chart.mouseleave':
          this.emitOuter('mouseleave',event.payload);
          break;
        default:
          break;
      }
    });
  }

}