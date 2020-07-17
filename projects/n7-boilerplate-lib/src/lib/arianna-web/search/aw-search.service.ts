import { Injectable } from '@angular/core';
import { AwSearchModel, AwSearchConfig } from './aw-search.model';

@Injectable({
  providedIn: 'root',
})
export class AwSearchService {
  private _models: any = {};

  public add(id: string, config: AwSearchConfig) {
    if (this._models[id]) {
      throw Error(`Search model '${id}' already exists!`);
    }

    this._models[id] = new AwSearchModel(id, config);
  }

  public remove(id: string) {
    if (this._models[id]) {
      delete this._models[id];
    }
  }

  public model(id: string): AwSearchModel {
    return this._models[id] || null;
  }
}
