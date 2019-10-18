import { EventHandler } from '@n7-frontend/core';

export class AwBubbleChartEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(event => {
      switch (event.type) {
        case 'aw-bubble-chart.init':
          break;
        case 'aw-bubble-chart.click':
          event.payload.entityIdmap = this.dataSource.getEntityIdMap();
          event.payload.allBubbles = this.dataSource.getAllBubbles();
          this.emitOuter('click', event.payload);
          break;
        case 'aw-bubble-chart.mouse_enter':
          const currBubble = this.dataSource.onBubbleMouseEnter(
            {
              bubblePayload:event.payload.bubblePayload,
              bubble:event.payload.bubble
            });
          event.payload.currBubble = currBubble;
          this.emitOuter('mouse_enter', event.payload);
          break;
        case 'aw-bubble-chart.mouse_leave':
         /*   this.dataSource.onBubbleMouseLeave(
              {
                bubblePayload:event.payload.bubblePayload,
                bubble:event.payload.bubble
              });*/
          this.emitOuter('mouse_leave', event.payload);
          break;
          case "aw-bubble-chart.bubble-tooltip-close-click":
            this.emitOuter('bubble-tooltip-close-click', event.payload);
            break;
        case "aw-bubble-chart.bubble-tooltip-goto-click":
          this.emitOuter('bubble-tooltip-goto-click', event.payload);
            break;
        case "aw-bubble-chart.bubble-tooltip-select-click":
          this.emitOuter('bubble-tooltip-select-click', event.payload);
            break;
        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case "aw-home-layout.bubble-tooltip-select-click":
              let selectData = {
                'bubble': this.dataSource.onBubbleTooltipClick('select',payload),
                'entityIdmap': this.dataSource.getEntityIdMap(),
                'allBubbles': this.dataSource.getAllBubbles(),
                'source': 'bubble'
              };
              this.emitOuter('click', selectData);
              break;
        case 'aw-home-layout.bubble-filter':
          this.emitOuter('bubble-filtered',
          {
            'allBubbles': this.dataSource.getAllBubbles(),
            'selected': this.dataSource.getSelectedBubbles()
          });
          break;
        case 'aw-scheda-layout.filterbubbleresponse':
        case 'aw-entita-layout.filterbubbleresponse':
        case 'aw-home-layout.filterbubbleresponse':
          if( payload.source ){
            this.dataSource.setAllBubblesFromApolloQuery(payload);
            this.emitOuter('bubble-filtered',
            {
              'allBubbles': this.dataSource.getAllBubbles(),
              'selected': this.dataSource.getSelectedBubbles(),
              'entityIdmap': this.dataSource.getEntityIdMap()
            });
          } else {
            this.dataSource.update(payload);
          }
          break;
      }
    });
  }
}