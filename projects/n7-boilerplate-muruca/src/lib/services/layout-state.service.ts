import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export enum LayoutState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  EMPTY = 'EMPTY',
  ERROR = 'ERROR',
}

@Injectable()
export class MrLayoutStateService {
  private stateContainers: {
    [key: string]: ReplaySubject<LayoutState>;
  } = {};

  add(id: string | string[]) {
    const ids = Array.isArray(id) ? id : [id];
    ids.forEach((key) => {
      this.stateContainers[key] = new ReplaySubject();
      // initial state
      this.stateContainers[key].next(LayoutState.IDLE);
    });
  }

  get$(id: string) {
    if (!this.stateContainers[id]) {
      throw Error(`Layout state id '${id}' does not exists`);
    }
    return this.stateContainers[id];
  }

  set(id: string, newState: LayoutState) {
    if (!this.stateContainers[id]) {
      throw Error(`Layout state id '${id}' does not exists`);
    }
    this.stateContainers[id].next(newState);
  }
}
