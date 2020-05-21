import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { isEmpty } from 'lodash';
import { MrSearchLayoutDS } from './search-layout.ds';
import { MrSearchService, REQUEST_STATE_CONTEXT, INPUT_STATE_CONTEXT } from '../../services/search.service';
import resultsMock from './search-layout.mock';

export class MrSearchLayoutEH extends EventHandler {
  public dataSource: MrSearchLayoutDS;

  private destroyed$: Subject<boolean> = new Subject();

  private searchService: MrSearchService;

  private searchState: {
    [key: string]: any;
  } = {};

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-layout.init':
          this.searchService = payload.searchService;
          this.dataSource.onInit(payload);
          // listeners
          this.initStateListener();
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
          const stateValue = this.searchState[payload.id];
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

  initStateListener() {
    // request listener
    this.searchService.getState$(REQUEST_STATE_CONTEXT).subscribe(({ lastUpdated, state }) => {
      console.warn('request', lastUpdated, state);
    });
    // inputs listener
    this.searchService.getState$(INPUT_STATE_CONTEXT).subscribe(({ lastUpdated, state }) => {
      this.searchState = state;
      this.dataSource.updateActiveFilters(state);
      console.warn('input', lastUpdated, state);
    });

    this.searchService.getState$(REQUEST_STATE_CONTEXT, 'loading').subscribe(() => {
      this.dataSource.setSectionState('results', 'LOADING');
    });

    // hook (test)
    this.searchService.setBeforeHook(REQUEST_STATE_CONTEXT, 'success', () => {
      const { page, sort } = this.searchState;
      return resultsMock(page || 1, sort || '_score_DESC');
    });

    this.searchService.getState$(REQUEST_STATE_CONTEXT, 'success')
      .subscribe((response) => {
        this.dataSource.handleResponse(response);
        // update layout state
        this.dataSource.setSectionState('results', isEmpty(response.results) ? 'EMPTY' : 'OK');
      });
  }
}
