import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';

export class AwHomeLayoutEH extends EventHandler {
  private destroyed$: Subject<any> = new Subject();
  private configuration: any;
  private route: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-home-layout.init':
          this.dataSource.onInit(payload);
          this.loadFilters();
          this.configuration = payload.configuration;
          break;
        case 'aw-home-layout.destroy':
          this.destroyed$.next();
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
              typeOfEntity: payload.inputPayload.replace('-search', ''),
              itemsPagination: {
                // offset: 0, limit: this.configuration.get('home-layout')['results-limit']
                offset: 0, limit: this.configuration.get('home-layout')['results-limit']
              }
            }
            this.dataSource.makeRequest$('autoComplete', params).subscribe(response => {
              this.emitOuter('facetswrapperresponse', { facetId: payload, response })
              this.dataSource.updateComponent(
                'aw-autocomplete-wrapper', // ID
                { key: payload.value, response }, // DATA
                { config: this.configuration } // OPTIONS
              )
            })
          }
          break;
        case 'aw-home-facets-wrapper.enter':
          this.dataSource.handleFacetSearchEnter(payload);
          break;
        case "aw-bubble-chart.bubble-tooltip-close-click":
          this.dataSource.onBubbleTooltipClick('close', payload);
          break;
        case "aw-bubble-chart.bubble-tooltip-goto-click":
          if (!payload || !payload.entityId) return;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [`aw/entita/${payload.entityId}`]
          });
          break;
        case "aw-bubble-chart.bubble-tooltip-select-click":
          payload._bubbleChart = this.dataSource._bubbleChart;
          this.emitOuter('bubble-tooltip-select-click', payload);
          break;
        case 'aw-bubble-chart.click':
          if (payload.source === 'bubble') {
            if (payload.bubble) {
              console.log({payload})
              this.dataSource.updateBubbleFilter(payload);
              if (this.dataSource.onBubbleSelected(payload.bubble)) {
                this.dataSource.filterRequest().subscribe((response) => {
                  if (response) {
                    // console.log('filterRequest() returned: ', response)
                    this.emitOuter('filterbubbleresponse', this.dataSource.getBubblePayload(response));
                    this.dataSource.updateBubbles(response);
                  }
                });
              }
            }
          } else if (payload.source === 'close') {
            this.dataSource.updateBubbleFilter(payload);
            this.dataSource.onBubbleDeselected({
              bubblePayload: payload.bubblePayload,
              bubble: payload.bubble
            }).subscribe((response) => {
              if (response) {
                this.emitOuter('filterbubbleresponse', this.dataSource.getBubblePayload(response));
                this.dataSource.updateBubbles(response);
              }
            });
          }
          break;
        case 'aw-bubble-chart.bubble-filtered':
          this.dataSource.updateBubbleFilter(payload);
          this.dataSource.updateTags();
          const dataSource = this.dataSource;
          setTimeout(function () {
            dataSource.loadingBubbles = false;
          }, 500);
          break;

        /**
         * Tags & Item Previews Event Handlers
         */
        case 'aw-home-item-tags-wrapper.click':
          this.dataSource.onTagClicked(payload).subscribe((response) => {
            this.emitOuter('filterbubbleresponse', this.dataSource.getBubblePayload(response));
            this.dataSource.updateBubbles(response);
            this.dataSource.renderItemTags();
          });
          break;
        case 'aw-linked-objects.datarequest':
          let { currentPage } = payload
          let params = {
            selectedEntitiesIds: this.dataSource.selectedEntitiesIds,
            itemsPagination: {
              offset: currentPage * this.dataSource.resultsLimit,
              limit: this.dataSource.resultsLimit
            }
          }
          this.dataSource.makeRequest$('globalFilter', params).subscribe(res => {
            if (res) {
              this.emitOuter('dataresponse', { res })
            } else {
              console.log('Unable to fetch additional data.')
            }
          })
          break;
        case 'aw-autocomplete-wrapper.clickresult':
          this.handleSimpleAutocompleteClick(payload)
          break;
        default:
          break;
      }
    });
  }

  private loadFilters() {
    this.dataSource.initialFilterRequest().subscribe((response) => {
      console.log('(home) Apollo responded with:', response);
      if (response) {
        this.dataSource.parseInitialRequest(response);
        if (this.dataSource.bubblesEnabled) {
          let bubblePayload = {
            setBubbleChart: (bubbleCref) => this.dataSource._bubbleChart = bubbleCref,
            source: response,
            reset: false,
            facetData: this.dataSource.facetData
          };
          this.emitOuter('filterbubbleresponse', bubblePayload);
        }
      }
    });
  }

  public handleSimpleAutocompleteClick = payload => {
    let thebubble = this.dataSource.allBubbles.find(b => {
      let s = 'B_' + payload.replace(/-/g, '_')
      return b.id == s
    })
    if (thebubble) {
      this.dataSource.onBubbleSelected(thebubble)
    }
    if (this.dataSource.selectedEntitiesIds.indexOf(payload) < 0) {
      this.dataSource.selectedEntitiesIds.push(payload)
      this.dataSource.communication.request$('globalFilter', {
        onError: (error) => console.error(error),
        params: {
          selectedEntitiesIds: this.dataSource.selectedEntitiesIds,
          itemsPagination: {
            offset: 0,
            limit: this.dataSource.resultsLimit
          }
        },
      }).subscribe(res => {
        if (res) {
          this.dataSource.updateBubbleFilter({
            allBubbles: this.dataSource.allBubbles,
            bubble: thebubble,
            bubblePayload: { id: thebubble.id },
            entityIdmap: this.dataSource.entityBubbleIdMap,
            source: 'bubble'
          })
          this.dataSource.filterRequest().subscribe(res => {
            if (res) {
              this.emitOuter('filterbubbleresponse', this.dataSource.getBubblePayload(res))
              this.dataSource.updateBubbles(res)
            }
          })
          // this.renderPreviewsFromApolloQuery(res)
        }
      })
    }
  }

}

