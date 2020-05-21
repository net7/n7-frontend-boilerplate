import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import {
  filter,
  switchMap,
  map,
  debounceTime,
  delay,
} from 'rxjs/operators';
import { CommunicationService } from '../../common/services/communication.service';
import searchHelper from '../helpers/search-helper';

export const INPUT_STATE_CONTEXT = 'input';
export const FACET_STATE_CONTEXT = 'facet';
export const REQUEST_STATE_CONTEXT = 'request';

@Injectable()
export class MrSearchService {
  private config;

  private queryParamKeys: string[] = [];

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

  public init(config) {
    this.config = config;

    // initial states
    this.initInputState();
    this.initFacetState();

    // listeners
    this.onInputsChange();
    this.onRouteChange();
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
      [header, ...inputs].forEach(({ id, queryParam }) => {
        this.addState(INPUT_STATE_CONTEXT, id);

        if (queryParam) {
          this.queryParamKeys.push(id);
        }
      });
    });

    // set layout input state
    layoutInputs.forEach(({ id, queryParam }) => {
      this.addState(INPUT_STATE_CONTEXT, id);

      if (queryParam) {
        this.queryParamKeys.push(id);
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
    const { request } = this.config;

    // add context state
    this.addStateContext(REQUEST_STATE_CONTEXT);

    // default states
    ['loading', 'success', 'error'].forEach((id) => {
      this.addState(REQUEST_STATE_CONTEXT, id);
    });

    this.activatedRoute.queryParams.pipe(
      delay(1), // fix initial listeners (symbolic timeout)
      map((params) => {
        this.setState(REQUEST_STATE_CONTEXT, 'loading', params);
        return params;
      }),
      debounceTime(request.delay || 1),
      switchMap((state) => this.communication.request$(request.id, {
        params: state,
        onError: (error) => {
          this.setState(REQUEST_STATE_CONTEXT, 'error', error);
        }
      }, request.provider || null))
    ).subscribe((response) => {
      this.setState(REQUEST_STATE_CONTEXT, 'success', response);
    });
  }

  private onInputsChange() {
    this.getState$('input').pipe(
      filter(({ lastUpdated }) => this.queryParamKeys.indexOf(lastUpdated) !== -1)
    ).subscribe(({ state }) => {
      const queryParams = searchHelper.stateToQueryParams(state);
      this.router.navigate([], {
        queryParams
      });
    });
  }
}
