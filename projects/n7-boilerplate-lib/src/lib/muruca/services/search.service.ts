import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  filter,
  switchMap,
  map,
  debounceTime,
  delay,
  tap,
} from 'rxjs/operators';
import { isEmpty, xor } from 'lodash';
import { CommunicationService } from '../../common/services/communication.service';
import searchHelper from '../helpers/search-helper';
import { InputSchema } from '../interfaces/search.interface';

export const INPUT_STATE_CONTEXT = 'input';
export const FACET_STATE_CONTEXT = 'facet';
export const RESULTS_REQUEST_STATE_CONTEXT = 'resultsRequest';
export const FACETS_REQUEST_STATE_CONTEXT = 'facetsRequest';

@Injectable()
export class MrSearchService {
  private searchId: string | number;

  private config;

  private queryParamKeys: string[] = [];

  private inputSchemas: {
    [key: string]: InputSchema;
  } = {};

  private contextState: {
    [key: string]: any;
  } = {};

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

    // listeners
    this.onInputsChange();
    this.onRouteChange();
    this.onResultsLoading();
  }

  public getConfig = () => this.config;

  public getState$(context: string, id?: string): Subject<any> {
    const stateId = id ? `${context}.${id}` : context;
    if (!this.state$[stateId]) {
      throw Error(`Key "${stateId}" does'nt exists`);
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
        State context "${context}" does'nt exists.
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
      throw Error(`Key "${stateId}" does'nt exists`);
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
      throw Error(`Key "${stateId}" does'nt exists`);
    }

    this.beforeHook[stateId] = hook;
  }

  public reset() {
    // clear input states
    Object.keys(this.contextState[INPUT_STATE_CONTEXT]).forEach((id) => {
      this.setState(INPUT_STATE_CONTEXT, id, null);
    });
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
      [header, ...inputs].forEach(({ id, queryParam, schema }) => {
        this.addState(INPUT_STATE_CONTEXT, id);

        // is query param?
        if (queryParam) {
          this.queryParamKeys.push(id);
        }

        // schemas
        if (schema) {
          this.inputSchemas[id] = schema;
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
      [header, ...inputs].forEach((input) => {
        this.addState(FACET_STATE_CONTEXT, input.id);
      });
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
              .forEach((inputId) => {
                this.setState(INPUT_STATE_CONTEXT, inputId, params[inputId]);
              });
          } else {
            Object.keys(inputContext)
              .filter((inputId) => this.notEquals(inputContext[inputId], params[inputId]))
              .forEach((inputId) => {
                this.setState(INPUT_STATE_CONTEXT, inputId, params[inputId] || null);
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
        this.setState(FACETS_REQUEST_STATE_CONTEXT, 'loading', params);
        return params;
      }),
      debounceTime(facets.delay || 1),
      map((params) => {
        this.setState(FACETS_REQUEST_STATE_CONTEXT, 'request', params);
        return params;
      }),
      switchMap((state) => this.communication.request$(facets.id, {
        params: { ...state, searchId: this.searchId },
        method: 'POST',
        onError: (error) => {
          this.setState(FACETS_REQUEST_STATE_CONTEXT, 'error', error);
        }
      }, facets.provider || null))
    ).subscribe((response) => {
      this.setState(FACETS_REQUEST_STATE_CONTEXT, 'success', response);
    });

    // update facet links
    this.getState$(FACETS_REQUEST_STATE_CONTEXT, 'success').subscribe(({ inputs }) => {
      Object.keys(inputs).forEach((id) => {
        this.setState(FACET_STATE_CONTEXT, id, {
          links: inputs[id]
        });
      });
    });
  }

  notEquals(val1, val2) {
    if (Array.isArray(val1) && Array.isArray(val2)) {
      return !!xor(val1, val2).length;
    }
    return val1 !== val2;
  }
}
