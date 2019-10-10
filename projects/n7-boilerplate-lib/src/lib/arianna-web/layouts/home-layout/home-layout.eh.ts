import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class AwHomeLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  private configuration: any;
  private route: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type) {
        case 'aw-home-layout.init':
          this.dataSource.onInit(payload);
          this.loadFilters();
          break;
        case 'aw-home-layout.destroy':
            this.destroyed$.next();
            break;
        default:
            break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case 'aw-hero.change':
          const { inputPayload, value } = payload;
          // TODO: do something
          break;
        /**
         * Facets Event Handlers
         */
        case 'aw-home-facets-wrapper.click':
          this.dataSource.handleFacetHeaderClick(payload);
          break;
        case 'aw-home-facets-wrapper.change':
          this.dataSource.handleFacetSearchChange(payload);
          break;
        case 'aw-home-facets-wrapper.enter':
          this.dataSource.handleFacetSearchEnter(payload);
          break;
        case "aw-bubble-chart.bubble-tooltip-close-click":
            this.dataSource.onBubbleTooltipClick('close',payload);
            break;
        case "aw-bubble-chart.bubble-tooltip-goto-click":
            if(!payload || !payload.entityId) return;
            this.emitGlobal('navigate', {
              handler: 'router',
              path: [`aw/entita/${payload.entityId}/overview`]
            });
            break;
        case "aw-bubble-chart.bubble-tooltip-select-click":
            payload._bubbleChart = this.dataSource._bubbleChart;
            this.emitOuter('bubble-tooltip-select-click', payload);
            break;
        case 'aw-bubble-chart.click':
            let bubblePayload = {
              width: window.innerWidth / 1.8,
              setBubbleChart: (bubbleCref) => this.dataSource._bubbleChart = bubbleCref,
              reset: true,
              facetData: this.dataSource.facetData,
              selectedBubbles: this.dataSource.selectedBubbles
            }

          if ( payload.source === 'bubble' ){
            if (payload.bubble) {
              this.dataSource.updateBubbleFilter(payload);
              this.dataSource.onBubbleSelected(payload.bubble).subscribe((response) => {
                if ( response ) {
                  bubblePayload['source'] = response;
                  this.emitOuter('filterbubbleresponse', bubblePayload);
                  this.dataSource.updateBubbles(response);
                 }
               });
              }
            } else if (payload.source==='close') {
              this.dataSource.updateBubbleFilter(payload);
              this.dataSource.onBubbleDeselected({
                bubblePayload:payload.bubblePayload,
                bubble:payload.bubble
              }).subscribe((response) => {
                if ( response ) {
                  bubblePayload['source'] = response;
                  this.emitOuter('filterbubbleresponse', bubblePayload);
                  this.dataSource.updateBubbles(response);
                 }
               });
              }
            break;
        case 'aw-bubble-chart.bubble-filtered':
            this.dataSource.updateBubbleFilter(payload);
            this.dataSource.updateTags();
            break;
        /**
         * Tags & Item Previews Event Handlers
         */
        case 'aw-home-item-tags-wrapper.click':
            this.dataSource.onTagClicked(payload).subscribe((response) => {
              let bubblePayload = {
                width: window.innerWidth / 1.8,
                setBubbleChart: (bubbleCref) => this.dataSource._bubbleChart = bubbleCref,
                source: response,
                reset: true,
                facetData: this.dataSource.facetData,
                selectedBubbles: this.dataSource.selectedBubbles
              }
              this.emitOuter('filterbubbleresponse', bubblePayload);
              this.dataSource.updateBubbles(response);
             // this.dataSource.renderItemTags();
            });
            break;
        default:
            break;
      }
    });
  }

  private loadFilters(){
    this.dataSource.initialFilterRequest().subscribe((response) => {
      if( response ){
        this.dataSource.parseInitialRequest(response);
        let bubblePayload = {
          width: window.innerWidth / 1.8,
          setBubbleChart: (bubbleCref) => this.dataSource._bubbleChart = bubbleCref,
          source: response,
          reset: false,
          facetData: this.dataSource.facetData
        };
        this.emitOuter('filterbubbleresponse', bubblePayload);
      }
    });
  }
}