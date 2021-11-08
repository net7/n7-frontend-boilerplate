/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  fromEvent, Observable, of, Subject
} from 'rxjs';
import {
  filter,
  switchMap,
  map,
  debounceTime,
  delay,
  tap,
  takeUntil,
  switchMapTo
} from 'rxjs/operators';
import { isEmpty, xor } from 'lodash';
import { _t } from '@n7-frontend/core';
import { CommunicationService } from '../../common/services/communication.service';
import searchHelper from '../helpers/search-helper';
import { MrInputSchema } from '../interfaces/search.interface';

export const INPUT_STATE_CONTEXT = 'input';
export const FACET_STATE_CONTEXT = 'facet';
export const SECTION_STATE_CONTEXT = 'section';
export const RESULTS_REQUEST_STATE_CONTEXT = 'resultsRequest';
export const FACETS_REQUEST_STATE_CONTEXT = 'facetsRequest';

@Injectable()
export class MrSearchService {
  private destroyed$: Subject<void> = new Subject();

  private searchId: string | number;

  private config;

  private queryParamKeys: string[] = [];

  private initializeKeys: string[] = [];

  private initializeValues: {
    [id: string]: any;
  } = {};

  private inputSchemas: {
    [key: string]: MrInputSchema;
  } = {};

  private contextState: {
    [key: string]: any;
  } = {};

  private internalFilterKeys: string[] = [];

  private internalFilterState: {
    globalParams: any;
    facets: {
      [key: string]: any;
    };
  } = {
    globalParams: {},
    facets: {}
  };

  private state$: {
    [key: string]: Subject<any>;
  } = {};

  private beforeHook: {
    [key: string]: (value: any) => any;
  } = {};

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private communication: CommunicationService,
  ) { }

  public init(searchId, config) {
    this.searchId = searchId;
    this.config = config;

    // first clear
    this.clear();

    // initial states
    this.initInputState();
    this.initFacetState();
    this.initSectionState();

    // listeners
    this.onInputsChange();
    this.onInternalInputsChange();
    this.onRouteChange();
    this.onResultsLoading();
    this.onFacetsScroll();
  }

  public getConfig = () => this.config;

  public getState$(context: string, id?: string): Subject<any> {
    const stateId = id ? `${context}.${id}` : context;
    if (!this.state$[stateId]) {
      throw Error(`Key "${stateId}" does not exist`);
    }

    return this.state$[stateId];
  }

  public addStateContext(context: string) {
    if (this.state$[context]) {
      throw Error(`State key "${context}" already exists`);
    }

    // initial state
    this.contextState[context] = {};
    // create stream
    this.state$[context] = new Subject();
  }

  public addState(context: string, id: string) {
    const stateId = `${context}.${id}`;
    if (!this.state$[context]) {
      throw Error(`
        State context "${context}" does not exist.
        You must add context first
      `);
    }
    if (this.state$[stateId]) {
      throw Error(`State key "${stateId}" already exists`);
    }

    // create stream
    this.state$[stateId] = new Subject();
  }

  public setState(context: string, id: string, newValue: any) {
    const stateId = `${context}.${id}`;
    if (!this.state$[stateId]) {
      throw Error(`Key "${stateId}" does not exist`);
    }

    let value = newValue;
    // hook control
    if (this.beforeHook[stateId]) {
      value = this.beforeHook[stateId](value);
    }

    // update stream
    this.state$[stateId].next(value);
    // update context
    this.setContextState(context, id, value);
  }

  public setBeforeHook(context: string, id: string, hook) {
    const stateId = `${context}.${id}`;
    if (!this.state$[stateId]) {
      throw Error(`Key "${stateId}" does not exist`);
    }

    this.beforeHook[stateId] = hook;
  }

  public reset() {
    // clear input states
    Object.keys(this.contextState[INPUT_STATE_CONTEXT])
      .filter((id) => !this.internalFilterKeys.includes(id))
      .forEach((id) => {
        this.setState(INPUT_STATE_CONTEXT, id, null);
      });
  }

  public destroy() {
    this.destroyed$.next();
  }

  private clear() {
    this.contextState = {};
    this.state$ = {};
    this.beforeHook = {};
  }

  private setContextState(context: string, id: string, newValue: any) {
    this.contextState[context] = {
      ...this.contextState[context],
      [`${id}`]: newValue
    };
    this.state$[context].next({
      lastUpdated: id,
      state: this.contextState[context]
    });
  }

  private initInputState() {
    const { facets, layoutInputs } = this.config;
    // add context state
    this.addStateContext(INPUT_STATE_CONTEXT);

    // set facets input state
    facets.sections.forEach(({ header, inputs }) => {
      [header, ...inputs]
        .filter((input) => input)
        .forEach(({
          id, queryParam, schema, limit, type, target, initialize
        }) => {
          if (!id) {
            return;
          }
          this.addState(INPUT_STATE_CONTEXT, id);

          // is query param?
          if (queryParam) {
            this.queryParamKeys.push(id);
          }

          // input has initial values request
          if (initialize) {
            this.initializeKeys.push(id);
          }

          // schemas
          if (schema) {
            this.inputSchemas[id] = schema;
          }

          // links internal state
          if (type === 'link') {
            this.internalFilterState.facets[id] = {
              id,
              limit,
              offset: 0,
              query: '',
              loading: false,
              values: []
            };
          }

          // internal filters
          if (target) {
            this.internalFilterKeys.push(id);
          }
        });
    });

    // set layout input state
    layoutInputs.forEach(({ id, queryParam, schema }) => {
      this.addState(INPUT_STATE_CONTEXT, id);

      if (queryParam) {
        this.queryParamKeys.push(id);
      }

      // schemas
      if (schema) {
        this.inputSchemas[id] = schema;
      }
    });
  }

  private initFacetState() {
    const { facets } = this.config;
    // add context state
    this.addStateContext(FACET_STATE_CONTEXT);

    // set input state
    facets.sections.forEach(({ header, inputs }) => {
      [header, ...inputs]
        .filter((input) => input)
        .forEach((input) => {
          this.addState(FACET_STATE_CONTEXT, input.id);
        });
    });
  }

  private initSectionState() {
    const { facets } = this.config;
    // add context state
    this.addStateContext(SECTION_STATE_CONTEXT);

    // set input state
    facets.sections.forEach(({ id }) => {
      this.addState(SECTION_STATE_CONTEXT, id);
    });
  }

  private onRouteChange() {
    const { results } = this.config.request;

    // add context state
    this.addStateContext(RESULTS_REQUEST_STATE_CONTEXT);

    // default states
    ['loading', 'request', 'success', 'error'].forEach((id) => {
      this.addState(RESULTS_REQUEST_STATE_CONTEXT, id);
    });

    this.activatedRoute.queryParams.pipe(
      takeUntil(this.destroyed$),
      // fix initial listeners (symbolic timeout)
      delay(1),
      // query params to state
      map((params) => searchHelper.queryParamsToState(params, this.inputSchemas)),
      // state != queryParams control
      tap((params) => {
        if (isEmpty(params)) {
          this.reset();
        }

        // update state
        if (!isEmpty(params)) {
          const inputContext = this.contextState[INPUT_STATE_CONTEXT];
          if (isEmpty(inputContext)) {
            Object.keys(params)
              .filter((inputId) => this.queryParamKeys.includes(inputId))
              .forEach((inputId) => {
                this.setState(INPUT_STATE_CONTEXT, inputId, params[inputId]);
              });
          } else {
            Object.keys(params)
              .filter((inputId) => this.queryParamKeys.includes(inputId))
              .filter((inputId) => this.notEquals(inputContext[inputId], params[inputId]))
              .forEach((inputId) => {
                this.setState(
                  INPUT_STATE_CONTEXT,
                  inputId,
                  (params[inputId] || params[inputId] === 0)
                    ? params[inputId]
                    : null
                );
              });
          }
        }
      }),
      map((params) => {
        this.setState(RESULTS_REQUEST_STATE_CONTEXT, 'loading', params);
        return params;
      }),
      debounceTime(results.delay || 1),
      map((params) => {
        this.setState(RESULTS_REQUEST_STATE_CONTEXT, 'request', params);
        return params;
      }),
      switchMap((state) => this.communication.request$(results.id, {
        params: { ...state, searchId: this.searchId },
        method: 'POST',
        onError: (error) => {
          this.setState(RESULTS_REQUEST_STATE_CONTEXT, 'error', error);
        }
      }, results.provider || null))
    ).subscribe((response) => {
      this.setState(RESULTS_REQUEST_STATE_CONTEXT, 'success', response);
    });
  }

  private onInputsChange() {
    this.getState$(INPUT_STATE_CONTEXT).pipe(
      filter(({ lastUpdated }) => this.queryParamKeys.indexOf(lastUpdated) !== -1)
    ).subscribe(({ state }) => {
      const filteredState = {};
      Object.keys(state).forEach((id) => {
        if (this.queryParamKeys.indexOf(id) !== -1) {
          filteredState[id] = state[id];
        }
      });
      const queryParams = searchHelper.stateToQueryParams(filteredState, this.inputSchemas);
      this.router.navigate([], {
        queryParams
      });
    });
  }

  private onInternalInputsChange() {
    this.getState$(INPUT_STATE_CONTEXT).pipe(
      filter(({ lastUpdated }) => this.queryParamKeys.indexOf(lastUpdated) === -1),
      map(({ lastUpdated, state }) => {
        const { sections } = this.config.facets;
        let inputConfig;
        sections.forEach((section) => {
          section.inputs.forEach((input) => {
            if (input.id === lastUpdated) {
              inputConfig = input;
            }
          });
        });
        if (inputConfig && inputConfig.target) {
          return {
            inputConfig,
            value: state[lastUpdated]
          };
        }
        return null;
      }),
      filter((data) => data !== null),
    ).subscribe(({ inputConfig, value }) => {
      const { target } = inputConfig;
      // update internal filters
      this.internalFilterState.facets[target].query = value;
      this.internalFilterState.facets[target].offset = 0;
      this.doSingleFacetRequest(target);
    });
  }

  private doSingleFacetRequest(target) {
    const { facets } = this.config.request;
    const { globalParams } = this.internalFilterState;
    const {
      id, limit, offset, query
    } = this.internalFilterState.facets[target];
    this.communication.request$(facets.id, {
      params: {
        ...globalParams,
        facets: [{
          id, limit, offset, query
        }],
        searchId: this.searchId
      },
      method: 'POST',
      onError: (error) => {
        this.setState(FACETS_REQUEST_STATE_CONTEXT, 'error', error);
      }
    }, facets.provider || null).subscribe((response) => {
      this.onFacetsRequestSuccess(response);

      // reset loading
      this.internalFilterState.facets[target].loading = false;
    });
  }

  private onResultsLoading() {
    const { facets } = this.config.request;

    if (!facets) {
      return;
    }

    // add context state
    this.addStateContext(FACETS_REQUEST_STATE_CONTEXT);

    // default states
    ['loading', 'request', 'success', 'error'].forEach((id) => {
      this.addState(FACETS_REQUEST_STATE_CONTEXT, id);
    });

    this.getState$(RESULTS_REQUEST_STATE_CONTEXT, 'loading').pipe(
      map((params) => {
        const facetsParams = { ...params };
        this.setState(FACETS_REQUEST_STATE_CONTEXT, 'loading', facetsParams);
        // updated internal filter state
        this.internalFilterState.globalParams = { ...facetsParams };
        return facetsParams;
      }),
      debounceTime(facets.delay || 1),
      map((params) => {
        params.facets = [];
        this.config.facets.sections.forEach(({ inputs }) => {
          inputs.filter(({ type }) => type === 'link')
            .forEach(({ id }) => {
              // reset offset
              this.internalFilterState.facets[id].offset = 0;
              const { limit, query, offset } = this.internalFilterState.facets[id];
              params.facets.push({
                id, limit, offset, query
              });
            });
        });
        this.setState(FACETS_REQUEST_STATE_CONTEXT, 'request', params);
        return params;
      }),
      switchMap((state) => {
        let initializeRequest$: Observable<any> = of(true);
        if (this.initializeKeys.length) {
          initializeRequest$ = this.communication.request$(facets.id, {
            params: {
              facets: state.facets,
              searchId: this.searchId
            },
            method: 'POST',
            onError: (error) => {
              this.setState(FACETS_REQUEST_STATE_CONTEXT, 'error', error);
            }
          }, facets.provider || null);
        }
        return initializeRequest$.pipe(
          tap((response) => {
            if (response.facets) {
              Object.keys(response.facets).forEach((inputKey) => {
                this.initializeValues[inputKey] = response.facets[inputKey];
              });
            }
          }),
          switchMapTo(of(state))
        );
      }),
      switchMap((state) => this.communication.request$(facets.id, {
        params: {
          ...state,
          searchId: this.searchId
        },
        method: 'POST',
        onError: (error) => {
          this.setState(FACETS_REQUEST_STATE_CONTEXT, 'error', error);
        }
      }, facets.provider || null))
    ).subscribe((response: any) => {
      this.onFacetsRequestSuccess(response);
    });

    // update facet links
    this.getState$(FACETS_REQUEST_STATE_CONTEXT, 'success').subscribe((response) => {
      const { facets: responseFacets } = response;
      Object.keys(responseFacets).forEach((id) => {
        const { values: responseValues, filtered_total_count } = responseFacets[id];
        const { limit, offset, values: stateValues } = this.internalFilterState.facets[id];
        const filterState = this.internalFilterState.facets[id];
        if (offset > 0) {
          // delete loading element
          filterState.values.pop();
          // merge new results
          filterState.values = [
            ...stateValues,
            ...responseValues
          ];
        } else {
          filterState.values = [
            ...responseValues
          ];
        }
        if ((offset + limit) < filtered_total_count) {
          filterState.values.push({
            text: _t('global#facet_loading_text'),
            classes: 'loading-text-link',
            payload: null,
          });
        }
        this.setState(FACET_STATE_CONTEXT, id, {
          links: filterState.values
        });
      });
    });
  }

  private onFacetsRequestSuccess(response) {
    const { facets: responseFacets } = response;
    if (!isEmpty(this.initializeValues)) {
      Object.keys(responseFacets).forEach((inputKey) => {
        if (this.initializeValues[inputKey]) {
          // TODO: merge strategy
          console.log('TODO: merge strategy', responseFacets[inputKey], this.initializeValues[inputKey]);
        }
      });
    }
    Object.keys(responseFacets).forEach((inputKey) => {
      // update internal filter state
      const { filtered_total_count } = responseFacets[inputKey];
      this.internalFilterState.facets[inputKey].filtered_total_count = filtered_total_count;
      // responseFacets[inputKey].values = responseFacets[inputKey].values.map((item) => ({
      //   ...item,
      //   payload: item.payload && typeof item.payload === 'string'
      //     ? encodeURIComponent(item.payload)
      //     : item.payload
      // }));
    });
    this.setState(FACETS_REQUEST_STATE_CONTEXT, 'success', response);
  }

  private onFacetsScroll() {
    setTimeout(() => {
      const { facets } = this.config;
      facets.sections.forEach(({ inputs }) => {
        inputs
          .filter((input) => input)
          .filter((input) => input.type === 'link')
          .forEach(({ id }) => {
            const scrollEl = document.querySelector(`#facet-container-${id} .n7-input-link`);
            const scroll$ = fromEvent(scrollEl, 'scroll');
            scroll$.pipe(
              debounceTime(300)
            ).subscribe(({ target }) => {
              const {
                limit,
                offset,
                loading,
                filtered_total_count,
              } = this.internalFilterState.facets[id];
              const { scrollTop, clientHeight, scrollHeight } = target as HTMLElement;
              if (
                (scrollTop + clientHeight >= scrollHeight)
                && (offset + limit < filtered_total_count)
                && loading === false
              ) {
                this.internalFilterState.facets[id].loading = true;
                this.internalFilterState.facets[id].offset = offset + limit;
                this.doSingleFacetRequest(id);
              }
            });
          });
      });
    });
  }

  isQueryParamKey = (input) => this.queryParamKeys.includes(input);

  notEquals(val1, val2) {
    if (Array.isArray(val1) && Array.isArray(val2)) {
      return !!xor(val1, val2).length;
    }
    return val1 !== val2;
  }
}
