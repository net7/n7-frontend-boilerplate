import { EventHandler } from '@n7-frontend/core';

export class AwBubbleChartEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(event => {
      switch (event.type) {
        case 'aw-bubble-chart.click':
          this.emitOuter('click', event.payload);
          break;
        case 'aw-bubble-chart.mouse_enter':
          const currBubble = this.dataSource.onBubbleMouseEnter({bubblePayload:event.payload.bubblePayload, bubble:event.payload.bubble});
          event.payload.currBubble = currBubble;
          this.emitOuter('mouse_enter', event.payload);
          break;
        case 'aw-bubble-chart.mouse_leave':
          this.emitOuter('mouse_leave', event.payload);
          break;
        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {


    });
  }
}