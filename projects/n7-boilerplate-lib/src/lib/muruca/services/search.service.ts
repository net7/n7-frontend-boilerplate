import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable()
export class MrSearchService {
  private contextState: {
    [key: string]: any;
  } = {};

  private state$: {
    [key: string]: Subject<any>;
  } = {};

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

    // update stream
    this.state$[stateId].next(newValue);
    // update context
    this.setContextState(context, id, newValue);
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
}
