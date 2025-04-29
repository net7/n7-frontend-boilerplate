/* eslint-disable max-classes-per-file */
import { get as _get, isEmpty as _isEmpty } from 'lodash';
import { Subject } from 'rxjs';
import { helpers } from '@net7/boilerplate-common';
import {
  AwFacetInput,
  AwFacetInputCheckbox,
  AwFacetInputText,
  AwFacetInputLink,
  AwFacetInputSelect,
} from './aw-facet-inputs';

export type FilterOperators = '=' | '>' | '<' | '>=' | '<=' | '<>' | 'LIKE';
export type FacetTypes = 'value' | 'range';
export type FacetOperators = 'OR' | 'AND';

const INPUTS_MAP = {
  checkbox: AwFacetInputCheckbox,
  text: AwFacetInputText,
  link: AwFacetInputLink,
  select: AwFacetInputSelect,
};

const FILTERS_MAP = {
  '=': '_filterDataEquals',
  '>': '_filterDataGreaterThan',
  '<': '_filterDataLessThan',
  '>=': '_filterDataGreaterOrEquals',
  '<=': '_filterDataLessOrEquals',
  '<>': '_filterDataNotEqual',
  LIKE: '_filterDataLike',
};

export interface AwSearchConfig {
  totalCount: number;
  facets: any;
  page: any;
  results: any;
  fields: any;
}

export interface Facet {
  id: string;
  type: FacetTypes;
  operator: FacetOperators;
  hasStaticData?: boolean;
  searchData?: string[];
  data?: any;
}

export interface Filter {
  facetId: string;
  value: number | string | (number | string)[] | null;
  searchIn: Array<{
    key: string;
    operator?: FilterOperators;
  }>;
  isArray?: boolean;
  context?: 'internal' | 'external';
  target?: string;
  pagination?: {
    totalCount: number;
    limit: number;
    offset: number;
  };
}

export class AwSearchModel {
  static queryParams: any = null;

  private _id: string;

  private _filters: Filter[] = [];

  private _facets: Facet[] = [];

  private _inputs: AwFacetInput[] = [];

  private _page: any;

  private _totalCount: number | null;

  private _config: AwSearchConfig;

  private _results$: Subject<any[]> = new Subject();

  // OLD-VERSION
  // public _intervalFacet: any;

  constructor(id: string, config: AwSearchConfig) {
    this._id = id;
    this._config = config;

    this._setFilters();
    this._setFacets();
    this._setPage();
    this._setInputs();
    this._setInputsData();
    this._setTotalCount();

    // query params control
    /* eslint-disable @typescript-eslint/no-use-before-define */
    if (AwSearchModel.queryParams) {
      this.updateFiltersFromQueryParams(AwSearchModel.queryParams);
      AwSearchModel.queryParams = null;
    }
  }

  public getId = () => this._id;

  public getFilters = () => this._filters;

  public getFacets = () => this._facets;

  public getInputs = () => this._inputs;

  public getConfig = () => this._config;

  public getTotalCount = () => this._totalCount;

  public getFields = () => this._config.fields;

  public getResults$ = () => this._results$;

  public setResults = (results) => this._results$.next(results);

  public updateFilter(facetId, value, remove?: boolean) {
    const selectedFilters = this.getFiltersByFacetId(facetId);
    selectedFilters.forEach((filter) => {
      if (Array.isArray(filter.value) && remove) {
        filter.value = filter.value.filter((item) => item !== value);
      } else if (
        Array.isArray(filter.value)
        && filter.value.indexOf(value) === -1
      ) {
        filter.value.push(value);
      } else {
        filter.value = !remove ? helpers.escapeQuotes(value) : null;
      }
    });
  }

  public clear() {
    this.updateFiltersFromQueryParams({}, true);
    this._clearInputs();
  }

  public updateFiltersFromQueryParams(queryParams, clearAll = false) {
    this._facets.forEach(({ id }) => {
      const selectedFilters = this.getFiltersByFacetId(id);
      const value = queryParams[id];
      const isInternal = this.getInputByFacetId(id).getContext() === 'internal';

      if (isInternal && !clearAll) {
        return;
      }

      selectedFilters.forEach((filter) => {
        if (filter.isArray) {
          filter.value = value ? value.split(',') : [];
        } else {
          filter.value = value || null;
        }
      });
    });
  }

  public updateInputsFromFilters() {
    this._filters.forEach(({ facetId, value }) => {
      this.getInputByFacetId(facetId).setActive(value);
    });
  }

  public updateFacets(facets) {
    facets.forEach(({ id, data }) => this.updateFacet(id, data));
    this._setInputsData();
  }

  public updateTotalCount(totalCount) {
    this._totalCount = totalCount;
  }

  public updateFacet(facetId, data) {
    const selectedFacets = this._facets.filter((facet) => facet.id === facetId);
    if (!selectedFacets.length) {
      throw Error(`Facet with id '${facetId}' does not exists`);
    }

    selectedFacets.forEach((facet) => { facet.data = data; });
  }

  public reset() {
    this._filters.forEach((filter) => { filter.value = null; });
  }

  public getRequestParams() {
    return {
      facets: this._getRequestFacets(),
      page: this._page,
      results: this._config.results,
      filters: this._filters
        .filter((filter) => filter.context !== 'internal')
        .map(({
          facetId, value, searchIn, pagination
        }) => (pagination ? {
          facetId, value, searchIn, pagination
        } : {
          facetId, value, searchIn
        })),
    };
  }

  public getInternalFilters() {
    return this._filters
      .filter((filter) => (
        filter.context === 'internal'
        && !_isEmpty(filter.value)
      ))
      .map(({
        facetId, value, searchIn
      }) => ({
        facetId, value, searchIn
      }));
  }

  public filtersAsQueryParams(filters) {
    const queryParams: any = {};
    filters.forEach(
      (filter) => {
        queryParams[filter.facetId] = Array.isArray(filter.value)
          ? filter.value.join(',')
          : filter.value;
      },
    );

    return queryParams;
  }

  public getFiltersByFacetId(facetId: string) {
    return this._filters.filter((filter) => filter.facetId === facetId);
  }

  public getInputByFacetId(facetId: string) {
    return this._inputs.filter((input) => input.getFacetId() === facetId)[0];
  }

  public setInputData(facetId, data) {
    this.getInputByFacetId(facetId).setData(data);
  }

  public filterTarget(target) {
    const inputs = this._inputs.filter((input) => input.getTarget() === target);
    const targetInput = this.getInputByFacetId(target);
    const facet = this._facets.filter((f) => f.id === target)[0];
    const facetData = facet.data;

    const searchIns = [];
    inputs.forEach((input) => {
      const filter = this.getFiltersByFacetId(input.getFacetId())[0];
      const searchIn = input.getSearchIn();
      const { value } = filter;

      searchIns.push([searchIn, value]);
    });

    // filter
    facetData.forEach((item) => this._filterData(searchIns, item));

    // update
    targetInput.setData(facetData);

    if (targetInput.getConfig().emptyState) {
      const isEmpty = !facetData.filter((data) => !data.hidden).length;
      targetInput.setIsEmpty(isEmpty);
    }
    targetInput.update();
  }

  public setSearchConfigOrderBy(orderBy) {
    this._config.results.order.key = orderBy;
  }

  public setSearchConfigDirection(direction) {
    this._config.results.order.direction = direction;
  }

  public setSearchConfigType(type) {
    this._config.results.order.type = type;
  }

  public setPageConfigOffset(offset) {
    this._config.page.offset = offset;
  }

  public setPageConfigLimit(limit) {
    this._config.page.limit = limit;
  }

  private _clearInputs() {
    // do nothing
  }

  private _filterData(searchIns, item) {
    // reset
    item.hidden = false;
    searchIns.forEach(([searchIn, value]) => {
      searchIn.forEach(({ key, operator }) => {
        if (item.hidden) {
          return;
        }
        let refValue = _get(item, key, null);
        if (key.indexOf('searchData') !== -1 && Array.isArray(item.searchData)) {
          const searchDataKey = key.replace('searchData.', '');
          item.searchData.forEach(({ key: dataKey, value: dataValue }) => {
            if (dataKey === searchDataKey) {
              refValue = dataValue;
            }
          });
        }
        if (refValue === null) {
          item.hidden = true;
        } else if (FILTERS_MAP[operator]) {
          item.hidden = this[FILTERS_MAP[operator]](value, refValue);
        } else {
          console.warn(`SearchIn: operator ${operator} not supported`);
        }
      });
    });
  }

  private _filterDataEquals(value, refValue) {
    if (Array.isArray(refValue)) {
      if (Array.isArray(value)) {
        let inArray = value.length === 0;
        refValue.forEach((rv) => {
          if (value.indexOf(rv) !== -1) {
            inArray = true;
          }
        });
        return !(inArray);
      }
      return !(value && refValue.indexOf(value) !== -1);
    }
    if (Array.isArray(value)) {
      return !(
        !value.length || value.indexOf(refValue) !== -1
      );
    }
    return !(value && value === refValue);
  }

  private _filterDataGreaterThan(value, refValue) {
    if (!Array.isArray(value)) {
      return !(value && value > refValue);
    }
    return false;
  }

  private _filterDataLessThan(value, refValue) {
    if (!Array.isArray(value)) {
      return !(value && value < refValue);
    }
    return false;
  }

  private _filterDataGreaterOrEquals(value, refValue) {
    if (!Array.isArray(value)) {
      return !(value && value >= refValue);
    }
    return false;
  }

  private _filterDataLessOrEquals(value, refValue) {
    if (!Array.isArray(value)) {
      return !(value && value <= refValue);
    }
    return false;
  }

  private _filterDataNotEqual(value, refValue) {
    if (!Array.isArray(value)) {
      return !(value && value !== refValue);
    }
    return false;
  }

  private _filterDataLike(value, refValue) {
    if (
      value
      && typeof value === 'string'
      && typeof refValue === 'string'
    ) {
      const haystack = refValue.toLowerCase();
      const needle = value.toLocaleLowerCase();

      return !(haystack.indexOf(needle) !== -1);
    }
    return false;
  }

  private _setFilters() {
    this._config.fields.forEach((field) => {
      field.inputs.forEach((input) => this._filters.push({
        ...input.filterConfig,
        facetId: input.facetId,
        value: input.filterConfig.isArray ? [] : null,
      }));
    });
  }

  private _setFacets() {
    this._facets = this._config.facets;
  }

  private _setPage() {
    this._page = this._config.page;
  }

  private _setTotalCount() {
    this._totalCount = this._config.totalCount;
  }

  private _setInputs() {
    this._config.fields.forEach((sectionConfig, sectionIndex) => {
      sectionConfig.inputs.forEach((inputConfig, inputIndex) => {
        const InputModel = INPUTS_MAP[inputConfig.type];
        if (!InputModel) {
          throw Error(`Input type ${inputConfig.type} not supported`);
        }

        this._inputs.push(
          new InputModel({ ...inputConfig, inputIndex, sectionIndex }),
        );
      });
    });
  }

  private _setInputsData() {
    this._facets.forEach((facet) => this.setInputData(facet.id, facet.data));
  }

  private _getRequestFacets() {
    const results: Facet[] = [];
    this._facets.forEach((f) => {
      const facetConfig = { ...f };
      if (!f.hasStaticData) {
        delete facetConfig.data;
      }
      delete facetConfig.hasStaticData;

      // searchData control
      if (Array.isArray(facetConfig.data)) {
        facetConfig.data
          .filter((dataItem) => typeof dataItem.searchData !== 'undefined')
          .forEach((dataItem) => {
            delete dataItem.searchData;
          });
      }
      results.push(facetConfig);
    });
    return results;
  }
}
