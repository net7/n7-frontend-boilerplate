import { EventHandler } from '@n7-frontend/core';

export class AwHomeBubbleChartEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(event => {
      switch (event.type) {
        case 'aw-home-bubble-chart.click':
          this.emitOuter('click',event.payload);
          break;
        case 'aw-home-bubble-chart.mouse_enter':
          this.emitOuter('mouse_enter',event.payload);
          break;
        case 'aw-home-bubble-chart.mouse_leave':
          this.emitOuter('mouse_leave',event.payload);
          break;
        default:
          break;
      }
    });
  }

}