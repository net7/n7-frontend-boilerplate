import { EventHandler } from '@n7-frontend/core';
import { Subject, forkJoin } from 'rxjs';
import helpers from '../../../common/helpers';

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
        case 'aw-home-layout.outerlinkclick':
          this.emitGlobal('navigate', {
            handler: 'router',
            path: payload
          });
          break;
        case 'aw-home-layout.destroy':
          this.dataSource.onDestroy()
          break;
        case 'aw-home-layout.bubbleresultsviewallclick':
          const entityLinks = this.dataSource.selectedBubbles.join(',');
          const basePath = this.configuration.get('paths').searchBasePath;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [basePath],
            queryParams: { 'entity-links': entityLinks }
          });
          break;
        case 'aw-home-layout.clearselection':
          this.emitOuter('clearselection')
          break;
        default:
          console.warn('(home) unhandled inner event of type: ', type)
          break;
      }
    });

    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'aw-hero.enter':
        case 'aw-hero.click':
          const query = payload.value;
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [this.configuration.get("paths").searchBasePath],
            queryParams: { query }
          });
          break;
        case 'aw-hero.change':
          this.dataSource.autocompleteValue = payload.value
          this.dataSource.onHeroChange(payload.value);
          break;
        case 'aw-home-facets-wrapper.click':
          this.emitOuter('togglefilter', payload)
          break;
        case 'aw-home-facets-wrapper.change':
          if (
            !payload.value ||
            (typeof payload.value === 'string' && payload.value.trim().length === 0)
          ) {
            this.emitOuter('facetswrapperclose', { facetId: payload });
          } else if (payload.value) {
            this.emitOuter('facetswrapperrequest', { facetId: payload });
            // clear autocomplete results
            this.dataSource.updateComponent(
              'aw-autocomplete-wrapper',
              { key: payload.value, response: null }
            )
            let params = {
              input: payload.value,
              typeOfEntity: payload.inputPayload.replace(/-search/g, '').replace(/-/g, ' '),
              itemsPagination: {
                offset: 0, limit: this.configuration.get('home-layout')['results-limit']
              }
            }
            this.dataSource.makeRequest$('autoComplete', params).subscribe(response => {
              if (response.results.length < 1) {
                let fallback = {
                  totalcount: 0,
                  results: [
                    {
                      entity: {
                        id: 'fallback',
                        label: // use fallback string from configuration
                          this.configuration.get('home-layout')['autocomplete-fallback'] ?
                            this.configuration.get('home-layout')['autocomplete-fallback'] :
                            'Nessun risultato trovato'
                      }
                    }
                  ]
                }
                // this.emitOuter('facetswrapperresponse', { facetId: payload, response: fallback })
                this.dataSource.updateComponent(
                  'aw-autocomplete-wrapper',
                  { key: payload.value, response: fallback },
                  { config: this.configuration }
                )
              } else {
                // this.emitOuter('facetswrapperresponse', { facetId: payload, response })
                this.dataSource.updateComponent(
                  'aw-autocomplete-wrapper', // ID
                  { key: payload.value, response }, // DATA
                  { config: this.configuration } // OPTIONS
                )
              }
            })
          }
          break;
        case 'aw-home-facets-wrapper.enter':
          this.dataSource.handleFacetSearchEnter(payload);
          break;
        case 'aw-home-item-tags-wrapper.click':
          this.emitOuter('tagclick', payload)
          break;
        case 'aw-linked-objects.datarequest':
          const { currentPage } = payload;
          const params = {
            selectedEntitiesIds: this.dataSource.selectedBubbles,
            itemsPagination: {
              offset: currentPage * this.dataSource.resultsLimit,
              limit: this.dataSource.resultsLimit
            }
          };
          this.dataSource.makeRequest$('globalFilter', params).subscribe(res => {
            if (res) {
              this.emitOuter('dataresponse', { res })
            } else {
              console.log('Unable to fetch additional data.')
            }
          })
          break;
        case 'aw-linked-objects.click':
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [this.configuration.get("paths").schedaBasePath, payload.id, helpers.slugify(payload.title)]
          });
          break;
        case 'aw-autocomplete-wrapper.clickresult':
          this.handleSimpleAutocompleteClick(payload)
          break;
        case 'aw-home-autocomplete.click':
          const { source, type } = payload;
          let basePath;
          if (source === "item") {
            if (type === "oggetto-culturale") {
              basePath = this.configuration.get("paths").schedaBasePath;
            } else {
              basePath = this.configuration.get("paths").entitaBasePath;
            }
            this.emitGlobal('navigate', {
              handler: 'router',
              path: [basePath, payload.id, helpers.slugify(payload.title)]
            });
          } else if (source === "showMore") {
            const query = this.dataSource.homeAutocompleteQuery;
            basePath = this.configuration.get("paths").searchBasePath;
            this.emitGlobal('navigate', {
              handler: 'router',
              path: [basePath],
              queryParams: { query }
            });
          }
          break;
        case 'aw-bubble-chart.selection':
          this.handleChartSelection(payload)
          break;
        case 'aw-bubble-chart.lockfilter':
          this.emitOuter('lockfilter', payload) // let aw-home-facets-wrapper handle this event
          break;
        case 'aw-bubble-chart.bubble-tooltip-goto-click':
          this.emitGlobal('navigate', {
            handler: 'router',
            path: [
              this.configuration.get('paths').entitaBasePath,
              payload.id,
              helpers.slugify(payload.label)
            ]
          });
          break;
        default:
          break;
      }
    });
  }

  private loadFilters() {
    this.dataSource.initialFilterRequest().subscribe((response) => {
      // console.log('(home) Apollo responded with:', response)
      if (!response) { return }
      this.dataSource.parseInitialRequest(response);
      if (this.dataSource.bubblesEnabled) {
        this.emitOuter('filterbubbleresponse', response.entitiesData);
      }
    });
  }

  public handleSimpleAutocompleteClick = payload => {
    this.emitOuter('facetclick', payload)
  }

  public outerLinkClick(type, payload) {
    window.open(payload, "_blank");
  }

  public handleChartSelection = payload => {
    const selectedEntitiesIds = payload;
    this.dataSource.selectedBubbles = payload;
    this.dataSource.resultsListIsLoading = true;
    this.dataSource.makeRequest$('globalFilter', {
      selectedEntitiesIds,
      entitiesListSize: this.configuration.get('home-layout')['entitiesQuerySize']
    }).subscribe(res => {
      this.dataSource.resultsListIsLoading = false;
      if (res && res.entitiesData.length > 0) {
        // if some linked objects exist for the selected entities:
        this.dataSource.lastBubbleResponse = res.entitiesData
        this.emitOuter('filterbubbleresponse', res.entitiesData);
        this.dataSource.renderPreviewsFromApolloQuery(res)
        this.dataSource.renderItemTags()
      } else {
        // if the backend returns an empty list of results:
        const queryList = []
        this.dataSource.selectedBubbles.forEach(b => {
          let params = { entityId: b, entitiesListSize: 1 }
          queryList.push( // make a query for each selected bubble
            this.dataSource.makeRequest$('getMissingBubble', params)
          )
        });
        // await for every missing bubble and build a custom response
        forkJoin(queryList).subscribe(forkres => {
          let customBubbles = []
          forkres.forEach(r => { customBubbles.push({ count: 0, entity: r }) });
          this.emitOuter('filterbubbleresponse', customBubbles);
          this.dataSource.renderPreviewsFromApolloQuery(res)
          this.dataSource.renderItemTags()
        })
      }
    })
  }

}
