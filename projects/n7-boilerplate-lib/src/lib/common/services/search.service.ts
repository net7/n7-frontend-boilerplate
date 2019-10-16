import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { FacetInput, FacetInputCheckbox } from '../models';

export type FilterOperators = '=' | '>' | '<' | '>=' | '<=' | '<>' | 'LIKE';
export type FacetTypes = 'value' | 'range';
export type FacetOperators = 'OR' | 'AND';

const HEADER_ICON_OPEN = 'n7-icon-angle-down';
const HEADER_ICON_CLOSE = 'n7-icon-angle-right';

export interface ISearchConfig {
  facets: any;
  page: any;
  resultFields: any;
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
  private _groups: any[] = [];
  private _page: any;
  private _config: ISearchConfig;
  private _results$: Subject<any[]> = new Subject();

  constructor(id: string, config: ISearchConfig){
    this._id = id;
    this._config = config;

    this._setFilters();
    this._setFacets();
    this._setPage();
    this._setGroups();
  }

  public getId = () => this._id;
  public getFilters = () => this._filters;
  public getFacets = () => this._facets;
  public getConfig = () => this._config;
  public getFields = () => this._config.fields;
  public getResults$ = () => this._results$;
  public getGroups = () => this._groups;

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
      resultFields: this._config.resultFields,
      filters: this._filters
        .filter(filter => { 
          return (filter.context !== 'internal') && (
            (Array.isArray(filter.value) && filter.value.length) || 
            (!Array.isArray(filter.value) && filter.value)
          );
        })
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

  private _setFilters(){
    this._config.fields.forEach(field => {
      field.inputs.forEach(input => this._filters.push({ 
        ...input.filterConfig,
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

  private _setGroups(){
    this._config.fields.forEach((fieldConfig, fieldIndex) => {
      const groupId = `group-${this._id}-${fieldIndex}`;
      
      // header config
      const header = this._headerConfig(fieldConfig.header, groupId);

      // inputs config
      let sections = [];
      fieldConfig.inputs.forEach(inputConfig => {
        const { facetId } = inputConfig,
          facetConfig: any = this._facets.filter(facet => facet.id === facetId)[0] || {};

        let inputs = [];

        // checkboxes
        if(inputConfig.type === 'checkbox'){
          const input = new FacetInputCheckbox(inputConfig);
          input.setData(facetConfig.data);
          input.setInputConfig();

          this._inputs.push(input);
          (input.getInputConfig() || []).forEach(config => inputs.push(config));
        }

        // search
        if(inputConfig.type === 'search'){
          // inputs = this._searchConfig(facetConfig.data, inputConfig, fieldId);
        }

        // links
        if(inputConfig.type === 'link'){
          // inputs = this._linkConfig(facetConfig.data, inputConfig, fieldId);
        }

        // select
        if(inputConfig.type === 'select'){
          // inputs = this._selectConfig(facetConfig.data, inputConfig, fieldId);
        }

        // add to sections
        sections.push({ inputs });
      });

      this._groups.push({ 
        header,
        facet: { sections },
        classes: `n7-facets-wrapper__${groupId}`,
        isOpen: true, 
        _meta: {
          groupId
        }
      })
    })
  }

  private _headerConfig(header, groupId){
    return header ? {
      text: header.label,
      iconRight: HEADER_ICON_OPEN,
      classes: header.classes,
      payload: {
        source: 'group-header',
        id: `${groupId}-header`,
        groupId: groupId
      },
      _meta: {
        id: `${groupId}-header`
      }
    }: null;
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