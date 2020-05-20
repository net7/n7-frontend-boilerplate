import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { isEmpty } from 'lodash';
import { MrSearchLayoutDS } from './search-layout.ds';
import { MrSearchService } from '../../services/search.service';
import resultsMock from './search-layout.mock';

export class MrSearchLayoutEH extends EventHandler {
  public dataSource: MrSearchLayoutDS;

  private destroyed$: Subject<boolean> = new Subject();

  private searchService: MrSearchService;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-layout.init':
          this.searchService = payload.searchService;
          this.dataSource.onInit(payload);
          // listeners
          this.onSearchStateChange();
          break;

        case 'mr-search-layout.destroy':
          this.destroyed$.next(true);
          break;

        case 'mr-search-layout.searchreset':
          console.warn('#TODO: reset search');
          break;

        default:
          console.warn('unhandled inner event of type', type);
          break;
      }
    });


    this.outerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'n7-smart-pagination.click':
          this.searchService.setState('input', 'page', payload.page);
          break;

        case 'n7-smart-pagination.change':
          this.searchService.setState('input', 'limit', payload.value);
          break;

        case 'mr-search-results-title.change':
          this.searchService.setState('input', 'sort', payload.value);
          break;

        case 'mr-search-tags.click': {
          const stateValue = this.dataSource.state[payload.id];
          let newValue = null;
          if (Array.isArray(stateValue)) {
            stateValue.splice(stateValue.indexOf(payload.value), 1);
            newValue = stateValue;
          }
          this.searchService.setState('input', payload.id, newValue);
          break;
        }

        default:
          break;
      }
    });
  }

  onSearchStateChange() {
    // request listener
    this.searchService.getState$('request').subscribe(({ lastUpdated, state }) => {
      console.warn('request', lastUpdated, state);
    });
    // inputs listener
    this.searchService.getState$('input').subscribe(({ lastUpdated, state }) => {
      this.dataSource.state = state;
      console.warn('input', lastUpdated, state);
    });

    this.searchService.getState$('request', 'loading').subscribe(() => {
      this.dataSource.setSectionState('results', 'LOADING');
    });

    this.searchService.getState$('request', 'success').pipe(
      map(() => {
        const { page, sort } = this.dataSource.state;
        return resultsMock(page || 1, sort || '_score_DESC');
      })
    ).subscribe((response) => {
      this.dataSource.handleResponse(response);
      this.dataSource.setSectionState('results', isEmpty(response.results) ? 'EMPTY' : 'OK');
    });
  }
}
