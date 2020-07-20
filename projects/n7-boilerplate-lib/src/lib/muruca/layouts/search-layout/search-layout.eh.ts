import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { isEmpty } from 'lodash';
import { MrSearchLayoutDS } from './search-layout.ds';
import {
  MrSearchService,
  RESULTS_REQUEST_STATE_CONTEXT,
  INPUT_STATE_CONTEXT,
  FACETS_REQUEST_STATE_CONTEXT,
  SECTION_STATE_CONTEXT
} from '../../services/search.service';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';

export class MrSearchLayoutEH extends EventHandler {
  public dataSource: MrSearchLayoutDS;

  private destroyed$: Subject<boolean> = new Subject();

  private searchService: MrSearchService;

  private layoutState: MrLayoutStateService;

  private searchState: {
    [key: string]: any;
  } = {};

  private linksResponse: any;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-layout.init':
          this.searchService = payload.searchService;
          this.layoutState = payload.layoutState;
          this.dataSource.onInit(payload);
          // listeners
          this.initStateListener();
          break;

        case 'mr-search-layout.destroy':
          this.destroyed$.next(true);
          break;

        case 'mr-search-layout.searchreset':
          this.searchService.reset();
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
            newValue = stateValue.filter((value) => value !== payload.value);
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
    // inputs listener
    this.searchService.getState$(INPUT_STATE_CONTEXT).subscribe(({ state }) => {
      this.searchState = state;
    });
    this.searchService.getState$(FACETS_REQUEST_STATE_CONTEXT, 'success').subscribe((response) => {
      this.linksResponse = response;
      this.dataSource.updateActiveFilters(this.searchState, this.linksResponse);

      // update sections
      if (response.inputs) {
        const { inputs } = response;
        Object.keys(inputs).forEach((inputKey) => {
          const currentInput = inputs[inputKey];
          this.searchService.setState(
            SECTION_STATE_CONTEXT,
            `section-${inputKey}`,
            Array.isArray(currentInput) && currentInput.length ? 'is-not-empty' : 'is-empty'
          );
        });
      }
    });

    this.searchService.getState$(RESULTS_REQUEST_STATE_CONTEXT, 'loading').subscribe(() => {
      this.layoutState.set('results', LayoutState.LOADING);
    });

    // default params hook
    this.searchService.setBeforeHook(RESULTS_REQUEST_STATE_CONTEXT, 'loading', (params = {}) => {
      const defaultParams = {
        page: 1,
        sort: '_score',
        limit: 1
      };
      Object.keys(defaultParams).forEach((key) => {
        params[key] = params[key] || defaultParams[key];
      });
      return params;
    });

    this.searchService.getState$(RESULTS_REQUEST_STATE_CONTEXT, 'success')
      .subscribe((response) => {
        this.dataSource.handleResponse(response);
        // update layout state
        this.layoutState.set('results', isEmpty(response.results) ? LayoutState.EMPTY : LayoutState.SUCCESS);
      });

    this.searchService.getState$(RESULTS_REQUEST_STATE_CONTEXT, 'error')
      .subscribe((error) => {
        console.warn(RESULTS_REQUEST_STATE_CONTEXT, error);
        this.layoutState.set('results', LayoutState.ERROR);
      });
  }
}
