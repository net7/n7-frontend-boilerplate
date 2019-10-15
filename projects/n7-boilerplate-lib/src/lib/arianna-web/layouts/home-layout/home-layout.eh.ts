import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class AwHomeLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  private configuration: any;
  private route: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-layout.init':
          this.dataSource.onInit(payload);
          this.configuration = payload.configuration;
          break;
        case 'aw-home-layout.destroy':
          this.destroyed$.next();
          break;
        case "aw-home-layout.bubble-tooltip-close-click":
          this.dataSource.onBubbleTooltipClick('close', payload);
          break;
        case "aw-home-layout.bubble-tooltip-goto-click":
          if (!payload || !payload.entityId) return;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/entita/${payload.entityId}/overview`]
          });
          break;
        case "aw-home-layout.bubble-tooltip-select-click":
          this.dataSource.onBubbleTooltipClick('select', payload);
          break;
        default:
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-hero.change':
          this.dataSource.onHeroChange(payload.value);
          break;
        case 'aw-home-facets-wrapper.click':
          this.dataSource.handleFacetHeaderClick(payload);
          break;
        case 'aw-home-facets-wrapper.change':
          if (payload.value) {
            let params = {
              input: payload.value,
              typeOfConfigKey: payload.inputPayload.replace('-search', ''),
              itemsPagination: {
                offset: 0, limit: this.configuration.get('home-layout')['results-limit']
              }
            }
            this.dataSource.makeRequest$('autoComplete', params).subscribe(response => {
              this.emitOuter('facetswrapperresponse', { facetId: payload, response })
              this.dataSource.updateComponent('aw-autocomplete-wrapper', {key: payload.value, response})
            })
          }
          break;
        case 'aw-home-facets-wrapper.enter':
          this.dataSource.handleFacetSearchEnter(payload);
          break;
        /**
         * Bubble Chart Event Handlers
         */
        case 'aw-home-bubble-chart.mouse_enter':
          this.dataSource.onBubbleMouseEnter({ bubblePayload: payload.bubblePayload, bubble: payload.bubble });
          break;
        case 'aw-home-bubble-chart.mouse_leave':
          // TODO: do something
          break;
        case 'aw-home-bubble-chart.click':
          if (payload.source === 'bubble') {
            if (payload.bubble) this.dataSource.onBubbleSelected(payload.bubble);
          } else if (payload.source === 'close')
            this.dataSource.onBubbleDeselected({ bubblePayload: payload.bubblePayload, bubble: payload.bubble });
          break;
        /**
         * Tags & Item Previews Event Handlers
         */
        case 'aw-home-item-tags-wrapper.click':
          this.dataSource.onTagClicked(payload);
          break;
        /**
         * Tags & Item Previews Event Handlers
         */
        case 'aw-home-autocomplete.click':
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [this.configuration.get('paths').entitaBasePath, payload.id]
          });
          break;
        default:
          break;
      }
    });
  }
}