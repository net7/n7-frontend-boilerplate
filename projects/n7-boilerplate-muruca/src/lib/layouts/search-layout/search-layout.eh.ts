import { EventHandler } from '@n7-frontend/core';
import { Subject } from 'rxjs';
import { isEmpty } from 'lodash';
import { takeUntil, filter } from 'rxjs/operators';
import { helpers } from '@n7-frontend/boilerplate-common';
import { MrSearchLayoutDS } from './search-layout.ds';
import {
  MrSearchService,
  RESULTS_REQUEST_STATE_CONTEXT,
  INPUT_STATE_CONTEXT,
  FACETS_REQUEST_STATE_CONTEXT,
  SECTION_STATE_CONTEXT
} from '../../services/search.service';
import { MrLayoutStateService, LayoutState } from '../../services/layout-state.service';
import { MrResourceModalService } from '../../services/resource-modal.service';

export class MrSearchLayoutEH extends EventHandler {
  public dataSource: MrSearchLayoutDS;

  private destroyed$: Subject<boolean> = new Subject();

  private searchService: MrSearchService;

  private layoutState: MrLayoutStateService;

  private modalService: MrResourceModalService;

  private searchState: {
    [key: string]: any;
  } = {};

  private linksResponse: any;

  private scrollRefElement: HTMLElement;

  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'mr-search-layout.init':
          this.searchService = payload.searchService;
          this.layoutState = payload.layoutState;
          this.modalService = payload.modalService;
          this.dataSource.onInit(payload);
          // listeners
          this.initStateListener();
          // scroll top
          window.scrollTo(0, 0);
          // reset scroll ref
          this.scrollRefElement = null;
          break;

        case 'mr-search-layout.destroy':
          this.searchService.destroy();
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

        case 'mr-search-page-description.click':
        case 'mr-search-page-title.click':
          this.dataSource.toggleDescription();
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

        case 'mr-search-results.openresourcemodal': {
          const { id, type: resourceType } = payload;
          this.modalService.open(id, resourceType);
          break;
        }

        default:
          break;
      }
    });
  }

  initStateListener() {
    // default params
    const { pageConfig } = this.dataSource;
    const defaultLimit = pageConfig.pagination.options[0];
    const defaultSort = pageConfig.sort.options.find((option) => option.selected === true)?.value;
    // inputs listener
    this.searchService.getState$(INPUT_STATE_CONTEXT).pipe(
      filter(({ lastUpdated }) => this.searchService.isQueryParamKey(lastUpdated)),
      takeUntil(this.destroyed$)
    ).subscribe(({ lastUpdated, state }) => {
      this.searchState = state;

      if (lastUpdated !== 'page') {
        this.searchService.setState(INPUT_STATE_CONTEXT, 'page', 1);
      }
    });
    this.searchService.getState$(INPUT_STATE_CONTEXT, 'query').pipe(
      takeUntil(this.destroyed$)
    ).subscribe((val) => {
      this.emitOuter('inputquerychange', val);
    });
    this.searchService.getState$(FACETS_REQUEST_STATE_CONTEXT, 'success').pipe(
      takeUntil(this.destroyed$)
    ).subscribe((response) => {
      this.linksResponse = response;
      this.dataSource.updateActiveFilters(this.searchState, this.linksResponse);

      // update sections
      if (response) {
        const { facets } = response;
        Object.keys(facets).forEach((inputKey) => {
          const { total_count: totalCount } = facets[inputKey];
          this.searchService.setState(
            SECTION_STATE_CONTEXT,
            `section-${inputKey}`,
            totalCount ? 'is-not-empty' : 'is-empty'
          );
        });
      }
    });

    this.searchService.getState$(RESULTS_REQUEST_STATE_CONTEXT, 'loading').pipe(
      takeUntil(this.destroyed$)
    ).subscribe(() => {
      this.layoutState.set('results', LayoutState.LOADING);
    });

    // results params hook
    this.searchService.setBeforeHook(RESULTS_REQUEST_STATE_CONTEXT, 'loading', (params: any = {}) => {
      const results: {
        limit: number;
        offset: number;
        sort?: string;
      } = {
        limit: defaultLimit,
        offset: 0
      };

      const sortParam = params.sort || defaultSort;

      // sort check
      if (sortParam) {
        results.sort = sortParam;
      }

      // limit check
      if (params.limit) {
        results.limit = params.limit;
      }

      // offset check
      if (params.page && params.page > 1) {
        results.offset = results.limit * (params.page - 1);
      }

      params.results = results;

      // cleanup
      Object.keys(params)
        .filter((key) => ['sort', 'page', 'limit'].includes(key))
        .forEach((key) => {
          delete params[key];
        });

      return params;
    });

    // facets params hook
    this.searchService.setBeforeHook(FACETS_REQUEST_STATE_CONTEXT, 'loading', (params: any = {}) => {
      // clean up
      delete params.results;
      return params;
    });

    this.searchService.getState$(RESULTS_REQUEST_STATE_CONTEXT, 'success')
      .subscribe((response) => {
        this.dataSource.handleResponse(response);
        // update layout state
        this.layoutState.set('results', isEmpty(response.results) ? LayoutState.EMPTY : LayoutState.SUCCESS);
        // scroll to ref element
        if (!pageConfig.disableScroll) {
          if (!this.scrollRefElement) {
            this.scrollRefElement = document.querySelector('.scroll-ref');
          } else if (!helpers.isElementInViewport(this.scrollRefElement)) {
            this.scrollRefElement.scrollIntoView();
          }
        }
      });

    this.searchService.getState$(RESULTS_REQUEST_STATE_CONTEXT, 'error')
      .subscribe((error) => {
        console.warn(RESULTS_REQUEST_STATE_CONTEXT, error);
        this.layoutState.set('results', LayoutState.ERROR);
      });
  }
}
