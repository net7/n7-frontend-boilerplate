import { DataSource } from '@n7-frontend/core';
import { SearchModel } from '../services/search.service';
import { FacetInputCheckbox, FacetInput } from '../models';

const HEADER_ICON_OPEN = 'n7-icon-angle-down';
const HEADER_ICON_CLOSE = 'n7-icon-angle-right';

export class FacetsWrapperDS extends DataSource {
  public searchModel: SearchModel;

  protected transform(data) {
    let groups = [];

    this.searchModel = data.searchModel;

    const id = this.searchModel.getId(),
      fields = this.searchModel.getFields();

    fields.forEach((fieldConfig, fieldIndex) => {
      const groupId = `group-${id}-${fieldIndex}`;
      
      // header config
      const header = this._headerConfig(fieldConfig.header, groupId);

      // inputs config
      let sections = [];
      this.searchModel.getInputs()
        .filter(input => input.getSectionIndex() === fieldIndex)
        .map(input => {
          input.update();
          return input.getOutput();
        })
        .forEach(output => {
          sections.push({ 
            inputs: Array.isArray(output) ? output : [output]
          });
        });

      groups.push({ 
        header,
        facet: { sections },
        classes: `n7-facets-wrapper__${groupId}`,
        isOpen: true, 
        _meta: {
          groupId
        }
      })

    });

    return { 
      groups, 
      classes: `n7-facets-wrapper__${this.searchModel.getId()}` 
    };
  }

  public toggleGroup({ eventPayload }){
    this.output.groups.forEach(group => {
      if(group._meta.groupId === eventPayload.groupId) {
        group.isOpen = !group.isOpen;
        group.header.iconRight = group.isOpen ? HEADER_ICON_OPEN : HEADER_ICON_CLOSE;
      }
    });
  }
  
  public onFacetChange({ eventPayload }){
    const { facetId, source, trigger } = eventPayload.inputPayload,
      filter = this.searchModel.getFiltersByFacetId(facetId)[0] || {},
      filterValue = filter['value'];

    let remove: boolean = false,
      value: any = eventPayload.inputPayload.value || eventPayload.value;

    // normalize
    value = '' + value;
      
    // remove control
    if(Array.isArray(filterValue)){
      remove = filterValue.indexOf(value) !== -1;
    } else {
      remove = filterValue === value;
    }

    // input text control
    // TODO: gestire i casi enter / icon click nel input text
    if(source === 'input-text' && ['enter', 'icon'].indexOf(trigger) !== -1) return;

    this.searchModel.updateFilter(facetId, value, remove);
    this.searchModel.updateInputsFromFilters();
  }

  public getRequestParams = () => this.searchModel.getRequestParams();
  public filtersAsQueryParams = (filters) => this.searchModel.filtersAsQueryParams(filters);
  public updateFiltersFromQueryParams = (queryParams) => this.searchModel.updateFiltersFromQueryParams(queryParams);

  public updateInputsFromFilters(){
    this.searchModel.updateInputsFromFilters();
  }

  /* private _updateInputCheckboxFromFilters(input, filters){
    filters.forEach(filter => {
      if(Array.isArray(filter.value) && filter.value.indexOf('' + input._meta.value) !== -1){
        input.checked = true;
      } else if(filter.value === input._meta.value) {
        input.checked = true;
      }
    });
  }

  private _updateInputSearchFromFilters(input, filters){
    filters.forEach(filter => {
      if(filter.value){
        input.value = filter.value;
      }
    });
  }

  private _updateInputLinkFromFilters(input, filters){
    filters.forEach(filter => {
      if(filter.value === input._meta.value){
        input.classes = 'is-active';
      }
    });
  }

  private _updateInputSelectFromFilters(input, filters){
    filters.forEach(filter => {
      input.options.forEach(option => {
        if(filter.value === option.value){
          option.selected = true;
        }
      })
    });
  } */

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

  /* 
  private _checkboxConfig(facetData, inputConfig, fieldId){
    return facetData.map((checkboxData, itemIndex) => {
      const elementId = `${fieldId}-checkbox-${itemIndex}`,
        { filterConfig } = inputConfig;

      return { 
        type: 'checkbox', 
        id: elementId, 
        label: checkboxData.label, 
        payload: {
          filterConfig,
          source: 'input-checkbox',
          value: checkboxData.value
        }, 
        _meta: {
          elementId,
          facetId: filterConfig.facetId,
          value: checkboxData.value
        } 
      };
    });
  }

  private _searchConfig(facetData, inputConfig, fieldId){
    const elementId = `${fieldId}-search`,
    { filterConfig } = inputConfig,
      payload = {
        filterConfig,
        source: 'input-search',
      };

    return [{ 
      type: 'text',
      id: elementId,
      label: inputConfig.label,
      disabled: inputConfig.disabled,
      placeholder: inputConfig.placeholder,
      icon: inputConfig.icon,
      inputPayload: {
        ...payload,
        trigger: 'input'
      },
      enterPayload: {
        ...payload,
        trigger: 'enter'
      },
      iconPayload: {
        ...payload,
        trigger: 'icon'
      },
      _meta: {
        facetId: filterConfig.facetId,
      }
    }];
  };

  private _linkConfig(facetData, inputConfig, fieldId){
    return facetData.map((linkData, itemIndex) => {
      const elementId = `${fieldId}-link-${itemIndex}`,
        { filterConfig } = inputConfig;

      return { 
        type: 'link', 
        id: elementId, 
        text: linkData.label, 
        counter: linkData.counter, 
        payload: {
          filterConfig,
          source: 'input-link',
          value: linkData.value
        },
        _meta: {
          elementId,
          facetId: filterConfig.facetId,
          value: linkData.value
        } 
      };
    });
  }

  private _selectConfig(facetData, inputConfig, fieldId){
    const elementId = `${fieldId}-select`,
    { filterConfig } = inputConfig;

    return [{ 
      type: 'select',
      id: elementId,
      label: inputConfig.label,
      disabled: inputConfig.disabled,
      options: facetData.map(({ value, label, selected }) => ({
        value, 
        label,
        selected
      })),
      payload: {
        filterConfig,
        source: 'input-select',
      },
      _meta: {
        facetId: filterConfig.facetId,
      }
    }];
  } */
}