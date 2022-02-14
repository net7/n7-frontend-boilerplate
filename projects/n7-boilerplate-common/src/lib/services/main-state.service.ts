import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MainStateService {
  // custom streams
  private custom: any = {};

  // default streams
  private default: {
    headTitle: ReplaySubject<any>;
    pageTitle: ReplaySubject<any>;
    subnav: ReplaySubject<any>;
    breadcrumbs: ReplaySubject<any>;
    filters: ReplaySubject<any>;
    header: ReplaySubject<any>;
  } = {
    headTitle: new ReplaySubject(),
    pageTitle: new ReplaySubject(),
    subnav: new ReplaySubject(),
    breadcrumbs: new ReplaySubject(),
    filters: new ReplaySubject(),
    header: new ReplaySubject(),
  };

  public get$ = (key: string) => this._get('default', key);

  public getCustom$ = (key: string) => this._get('custom', key);

  public update = (key: string, newValue: any) => this._update('default', key, newValue);

  public updateCustom = (key: string, newValue: any) => this._update('custom', key, newValue);

  public has = (key: string) => !!this.default[key];

  public hasCustom = (key: string) => !!this.custom[key];

  public addCustom(key: string, stream$: ReplaySubject<any>) {
    if (this.custom[key]) throw Error(`custom stream ${key} exists!`);

    this.custom[key] = stream$;
  }

  private _update(type: string, key: string, newValue: any) {
    if (!this[type]) throw Error(`${type} stream group does not exists!`);
    if (!this[type][key]) throw Error(`${type} stream ${key} does not exists!`);

    this[type][key].next(newValue);
  }

  private _get(type: string, key: string) {
    if (!this[type]) throw Error(`${type} stream group does not exists!`);
    if (!this[type][key]) throw Error(`${type} stream ${key} does not exists!`);

    return this[type][key];
  }
}
