import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class AwHomeLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type) {
        case 'aw-home-layout.init':
          this.dataSource.onInit(payload);
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
          // do something
          break;

        case 'aw-home-facets-wrapper.click':
          this.dataSource.handleFacetHeaderClick(payload);
          break;
        case 'aw-home-facets-wrapper.change':
          this.dataSource.handleFacetSearchChange(payload);
          break;
        case 'aw-home-facets-wrapper.enter':
          this.dataSource.handleFacetSearchEnter(payload);
          break;

        case 'aw-home-bubble-chart.click':
          if(payload.source==='bubble')
            this.dataSource.onBubbleSelected({bubblePayload:payload.bubblePayload,bubble:payload.bubble});
          else if(payload.source==='close')
            this.dataSource.onBubbleDeselected({bubblePayload:payload.bubblePayload,bubble:payload.bubble});
          break;

        case 'aw-home-bubble-chart.mouse_enter':
          // TODO: do something
          break;

        case 'aw-home-bubble-chart.mouse_leave':
          // TODO: do something
          break;

        case 'aw-home-item-tags-wrapper.click':
            this.dataSource.onTagClicked(payload);
            break;

        default:
            break;
      }
    });

    // listen to global events
    /* EventHandler.globalEvents$.pipe(
      takeUntil(this.destroyed$)
    ).subscribe(({type, payload}) => {
      switch(type){
        case 'global.navigate':
          this.dataSource.onNavigate(payload);
          break;

        default:
          break;
      }
    }); */
  }

}