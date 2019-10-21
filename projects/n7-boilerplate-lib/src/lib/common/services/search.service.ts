import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { 
  FacetInput, 
  FacetInputCheckbox,
  FacetInputText,
  FacetInputLink,
  FacetInputSelect,
} from '../models';

export type FilterOperators = '=' | '>' | '<' | '>=' | '<=' | '<>' | 'LIKE';
export type FacetTypes = 'value' | 'range';
export type FacetOperators = 'OR' | 'AND';

const INPUTS_MAP = {
  'checkbox': FacetInputCheckbox,
  'text': FacetInputText,
  'link': FacetInputLink,
  'select': FacetInputSelect,
};

export interface ISearchConfig {
  facets: any;
  page: any;
  results: any;
  fields: any;
  baseUrl: string;
}

export interface IFacet {
  id: string,
  type: FacetTypes;
  operator: FacetOperators;
  data?: any;
}

export interface IFilter {
  facetId: string;
  value: number | string | (number | string)[] | null;
  searchIn: Array<{
    key: string;  
    operator?: FilterOperators;
  }>;  
  isArray?: boolean;
  context?: 'internal' | 'external';
  target?: string;
}

export class SearchModel {
  private _id: string;
  private _filters: IFilter[] = [];
  private _facets: IFacet[] = [];
  private _inputs: FacetInput[] = [];
  private _page: any;
  private _config: ISearchConfig;
  private _results$: Subject<any[]> = new Subject();

  constructor(id: string, config: ISearchConfig){
    this._id = id;
    this._config = config;

    this._setFilters();
    this._setFacets();
    this._setPage();
    this._setInputs();
    this._setInputsData();
  }

  public getId = () => this._id;
  public getFilters = () => this._filters;
  public getFacets = () => this._facets;
  public getInputs = () => this._inputs;
  public getConfig = () => this._config;
  public getFields = () => this._config.fields;
  public getResults$ = () => this._results$;

  public setResults = (results) => this._results$.next(results);
  
  public updateFilter(facetId, value, remove?: boolean) {
    const selectedFilters = this.getFiltersByFacetId(facetId);
    selectedFilters.forEach(filter => {
      if(Array.isArray(filter.value) && remove){
        filter.value = filter.value.filter(item => item !== value);
      } else if(Array.isArray(filter.value) && filter.value.indexOf(value) === -1){
        filter.value.push(value);
      } else {
        filter.value = !remove ? value : null;
      }
    });
  }

  public updateFiltersFromQueryParams(queryParams) {
    Object.keys(queryParams).forEach(facetId => {
      const selectedFilters = this.getFiltersByFacetId(facetId),
        value = queryParams[facetId];

      selectedFilters.forEach(filter => {
        filter.value = filter.isArray ? value.split(',') : value;
      });
    });
  }

  public updateInputsFromFilters(){
    this._filters.forEach(({ facetId, value }) => {
      this._inputs
        .filter(input => input.getFacetId() === facetId)
        .forEach(input => {
          input.setActive(value); 
        })
    });
  }

  public updateFacet(facetId, data) {
    let selectedFacets = this._facets.filter(facet => facet.id === facetId);
    if(!selectedFacets.length){
      throw Error(`Facet with id "${facetId}" does not exists`);
    }

    selectedFacets.forEach(facet => facet.data = data);
  }

  public reset(){
    this._filters.forEach(filter => filter.value = null);
  }

  public getRequestParams(){
    return {
      facets: this._facets,
      page: this._page,
      results: this._config.results,
      filters: this._filters
        .filter(filter => filter.context !== 'internal')
        .map(({ facetId, value, searchIn }) => ({ facetId, value, searchIn }))
    }
  }

  public getInternalFilters(){
    return this._filters
        .filter(filter => { 
          return (filter.context === 'internal') && (
            (Array.isArray(filter.value) && filter.value.length) || 
            (!Array.isArray(filter.value) && filter.value)
          );
        })
        .map(({ facetId, value, searchIn }) => ({ facetId, value, searchIn }));
  }

  public filtersAsQueryParams(filters){
    let queryParams: any = {};
    filters.forEach(filter => queryParams[filter.facetId] = Array.isArray(filter.value) ? filter.value.join(',') : filter.value);

    return queryParams;
  }

  public getFiltersByFacetId(facetId: string){
    return this._filters.filter(filter => filter.facetId === facetId);
  }

  public getInputByFacetId(facetId: string){
    return this._inputs.filter(input => input.getFacetId() === facetId)[0];
  }

  public setInputData(facetId, data){
    this._inputs
      .filter(input => input.getFacetId() === facetId)
      .forEach(input => input.setData(data));
  }

  public filterTarget(target){
    const inputs = this._inputs.filter(input => input.getTarget() === target),
      facet = this._facets.filter(facet => facet.id === target)[0],
      facetData = facet.data;

    let searchMap = {};
    inputs.forEach(input => {
      const filter = this.getFiltersByFacetId(input.getFacetId())[0],
        searchIn = input.getSearchIn(),
        value = filter.value;

      facetData.forEach(item => {});
    });

    console.log('facetData', facetData);
  }

  private _filterMetadata(value, searchIn, metadata){
    // '=' EQUALS
    // '>' GREATER THAN
    // '<' LESS THAN
    // '>=' GREATER OR EQUALS
    // '<=' LESS OR EQUALS
    // '<>' NOT EQUAL
    //  'LIKE'
  }

  private _setFilters(){
    this._config.fields.forEach(field => {
      field.inputs.forEach(input => this._filters.push({ 
        ...input.filterConfig,
        facetId: input.facetId,
        value: input.filterConfig.isArray ? [] : null
      }));
    });
  }

  private _setFacets(){
    this._facets = this._config.facets;
  }

  private _setPage(){
    this._page = this._config.page;
  }

  private _setInputs(){
    this._config.fields.forEach((sectionConfig, sectionIndex) => {
      sectionConfig.inputs.forEach((inputConfig, inputIndex) => {
        const inputModel = INPUTS_MAP[inputConfig.type];
        if(!inputModel) throw Error(`Input type ${inputConfig.type} not supported`);

        this._inputs.push(new inputModel({ ...inputConfig, inputIndex, sectionIndex }));
      })
    });
  }

  private _setInputsData(){
    this._facets.forEach(facet => this.setInputData(facet.id, facet.data));
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
    return this._models[id] || null;
  }
}