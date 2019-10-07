import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface ISearchConfig {
  facets: any;
  page: any;
  resultFields: any;
  searchFields: any;
  inputs: any;
  baseUrl: string;
}

const DEFAULT_OPERATOR = 'AND';

class SearchModel {
  private _id: string;
  private _query: string;
  private _filters: any = {};
  private _state: ISearchConfig;
  private _initialState: ISearchConfig;
  public results$: Subject<any[]> = new Subject();

  constructor(id: string, config: ISearchConfig){
    this._id = id;
    this._state = config;
    this._initialState = config;
  }

  // SETTERS
  public setValue(facetId: string, value: any){
    const facetConfig = this._state.facets[facetId];
    if(!facetConfig) throw Error(`Facet "${facetId}" does not exists!`);

    // update input
    const input = this._state.inputs.find(({ id }) => id === facetId);
    if(input) input.value = value;

    // update filters
    this._filters[facetId] = {
      value,
      operator: facetConfig.operator || DEFAULT_OPERATOR
    };
  }
  public setQuery = (value: string) => this._query = value;
  public setResults = (results) => this.results$.next(results);
  
  // GETTERS
  public getId = () => this._id;
  public getParams() {
    const { facets, resultFields, searchFields } = this._state;
    return { 
      query: this._query, 
      filters: this._filters, 
      facets, 
      resultFields, 
      searchFields, 
    };
  }

  public reset(){
    this._state = this._initialState;
    this._filters = {};
    this._query = '';
  }
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private _models: any = {};

  public add(id: string, config: ISearchConfig){
    if(this._models[id]) throw Error(`Search model "${id}" already exists!`);

    this._models[id] = new SearchModel(id, config);
  }

  public model(id: string): SearchModel {
    if(!this._models[id]) throw Error(`Search model "${id}" does not exists!`);
    
    return this._models[id];
  }
}