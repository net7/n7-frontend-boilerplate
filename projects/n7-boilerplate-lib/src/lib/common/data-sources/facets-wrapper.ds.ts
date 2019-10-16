import { DataSource } from '@n7-frontend/core';
import { SearchModel } from '../services/search.service';

const HEADER_ICON_OPEN = 'n7-icon-angle-down';
const HEADER_ICON_CLOSE = 'n7-icon-angle-right';

export class FacetsWrapperDS extends DataSource {
  public searchModel: SearchModel;

  protected transform(data) {
    let groups = [];

    this.searchModel = data.searchModel;

    console.log(this.searchModel.getId(), 'loaded');

    const id = this.searchModel.getId(),
      facets = this.searchModel.getFacets(),
      fields = this.searchModel.getFields();

    fields.forEach((fieldConfig, fieldIndex) => {
      const groupId = `group-${id}-${fieldIndex}`;
      
      // header config
      const header = this._headerConfig(fieldConfig.header, groupId);

      // inputs config
      let sections = [];
      fieldConfig.inputs.forEach((inputConfig, inputIndex) => {
        const fieldId = `group-${id}-${fieldIndex}-${inputIndex}`,
          { facetId } = inputConfig.filterConfig,
          facetConfig: any = facets.filter(facet => facet.id === facetId)[0] || {};

        let inputs = [];

        // checkboxes
        if(inputConfig.type === 'checkbox'){
          inputs = this._checkboxConfig(facetConfig.data, inputConfig, fieldId);
        }

        // search
        if(inputConfig.type === 'search'){
          inputs = this._searchConfig(facetConfig.data, inputConfig, fieldId);
        }

        // links
        if(inputConfig.type === 'link'){
          inputs = this._linkConfig(facetConfig.data, inputConfig, fieldId);
        }

        // select
        if(inputConfig.type === 'select'){
          inputs = this._selectConfig(facetConfig.data, inputConfig, fieldId);
        }

        // add to sections
        sections.push({ inputs });
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
      classes: `n7-facets-wrapper__${id}` 
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
    const { filterConfig, source } = eventPayload.inputPayload;
    let remove: boolean = false,
      value: any = '' + eventPayload.inputPayload.value;
    
    // remove control
    if(source === 'input-checkbox'){
      remove = !eventPayload.value;
    }

    // input value control
    if(['input-search', 'input-select'].indexOf(source) !== -1){
      value = eventPayload.value;
    }

    // is-active control
    if(source === 'input-link'){
      // TODO
    }

    this.searchModel.updateFilter(filterConfig.facetId, value, remove);
  }

  public getRequestParams = () => this.searchModel.getRequestParams();
  public filtersAsQueryParams = (filters) => this.searchModel.filtersAsQueryParams(filters);
  public updateFiltersFromQueryParams = (queryParams) => this.searchModel.updateFiltersFromQueryParams(queryParams);

  public updateInputsFromFilters(){
    this.output.groups.forEach(group => {
      group.facet.sections.forEach(section => {
        section.inputs.forEach(input => {
          const { facetId } = input._meta,
            filters = this.searchModel.getFiltersByFacetId(facetId);

          // checkbox
          if(input.type === 'checkbox'){
            this._updateInputCheckboxFromFilters(input, filters);
          }

          // search
          if(input.type === 'search'){
            this._updateInputSearchFromFilters(input, filters);
          }

          // link
          if(input.type === 'link'){
            this._updateInputLinkFromFilters(input, filters);
          }

          // select
          if(input.type === 'select'){
            this._updateInputSelectFromFilters(input, filters);
          }
        });
      })
    });
  }

  private _updateInputCheckboxFromFilters(input, filters){
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
  }
}