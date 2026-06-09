import { DataSource } from '@net7/core';
import { AwSearchModel } from '../search/aw-search.model';
import entityLinksHelper from '../search/entity-links.helper';

const HEADER_ICON_OPEN = 'n7-icon-angle-down';
const HEADER_ICON_CLOSE = 'n7-icon-angle-right';

export class AwFacetsWrapperDS extends DataSource {
  public searchModel: AwSearchModel;

  protected transform(data) {
    if (!this.searchModel) {
      this.searchModel = data.searchModel;
      entityLinksHelper.initPagination(this.searchModel);
    }

    const id = this.searchModel.getId();
    const fields = this.searchModel.getFields();

    const groups = [];

    fields.forEach((fieldConfig, fieldIndex) => {
      const groupId = `group-${id}-${fieldIndex}`;

      // header config
      const header = this._headerConfig(fieldConfig.header, groupId);

      // inputs config
      const sections = [];
      this.searchModel.getInputs()
        .filter((input) => input.getSectionIndex() === fieldIndex)
        .map((input) => {
          input.update();
          return {
            facetId: input.getFacetId(),
            type: input.getType(),
            output: input.getOutput(),
          };
        })
        .forEach(({ type, output, facetId }) => {
          sections.push({
            classes: this._getSectionClasses(type),
            inputs: Array.isArray(output) ? output : [output],
            _meta: {
              facetId,
            },
          });
        });

      groups.push({
        header,
        facet: { sections },
        classes: `n7-facets-wrapper__${groupId}`,
        isOpen: true,
        _meta: {
          groupId,
        },
      });
    });

    return {
      groups,
      classes: `n7-facets-wrapper__${this.searchModel.getId()}`,
    };
  }

  public toggleGroup({ eventPayload }) {
    this.output.groups.forEach((group) => {
      if (group._meta.groupId === eventPayload.groupId) {
        group.isOpen = !group.isOpen;
        group.header.iconRight = group.isOpen ? HEADER_ICON_OPEN : HEADER_ICON_CLOSE;
      }
    });
  }

  public onFacetChange({ eventPayload }) {
    const { facetId, source, trigger } = eventPayload.inputPayload;
    const filter = this.searchModel.getFiltersByFacetId(facetId)[0] || { value: null };
    const filterValue = filter.value;

    let remove = false;
    let value: any = eventPayload.inputPayload.value || eventPayload.value;

    // normalize
    value = `${value}`;

    // config-driven validation (when the input declares one)
    if (source === 'input-text') {
      this._validateTextInput(facetId, value, trigger);
    }

    // remove control
    if (Array.isArray(filterValue)) {
      remove = filterValue.indexOf(value) !== -1;
    } else {
      remove = filterValue === value;
    }

    // input text control
    // TODO: gestire i casi enter / icon click nel input text
    // 'blur' only drives validation (handled above) and must not mutate
    // the filter — otherwise blurring a field with its current value would
    // match the remove-control and clear the active filter.
    if (source === 'input-text' && ['enter', 'icon', 'blur'].indexOf(trigger) !== -1) return;

    // Never apply an invalid value to the search: keep the typed text on
    // screen (so the field doesn't snap back) but leave the last valid
    // filter in place. Validity feedback is surfaced separately on blur.
    if (source === 'input-text') {
      const input = this.searchModel.getInputByFacetId(facetId);
      if (input && !input.isValid(value)) {
        input.setActive(value);
        return;
      }
    }

    this.searchModel.updateFilter(facetId, value, remove);
    this.searchModel.updateInputsFromFilters();
  }

  /**
   * Surfaces validation feedback for a text input. The error is shown on
   * blur/enter (so it never flashes mid-typing); once an error is visible
   * it is re-evaluated on every keystroke so it clears as soon as the
   * value becomes valid. No-op when the input declares no validation.
   */
  private _validateTextInput(facetId, value, trigger) {
    const input = this.searchModel.getInputByFacetId(facetId);
    if (!input || !input.getConfig().validation) {
      return;
    }
    const output = input.getOutput();
    const showErrors = trigger === 'blur' || trigger === 'enter';
    const clearingExisting = !!(output && output.error);
    if (!showErrors && !clearingExisting) {
      return;
    }
    input.validate(value);
    this.updateFilteredTarget(facetId);
  }

  public updateFilteredTarget(target) {
    if (!this.searchModel) {
      return;
    }
    const input = this.searchModel.getInputByFacetId(target);
    this.output.groups
      .map((group) => group.facet)
      .map((facet) => facet.sections)
      .forEach((sections) => {
        sections.forEach((section) => {
          if (section._meta.facetId === target) {
            const inputOutput = input.getOutput();
            section.inputs = Array.isArray(inputOutput) ? inputOutput : [inputOutput];
          }
        });
      });
  }

  public updateInputLinks() {
    if (!this.searchModel) {
      return;
    }
    const linksFacetIds = this.searchModel.getInputs()
      .filter((input) => input.getType() === 'link')
      .map((input) => input.getFacetId());

    this.output.groups
      .map((group) => group.facet)
      .map((facet) => facet.sections)
      .forEach((sections) => {
        sections.forEach((section) => {
          if (linksFacetIds.indexOf(section._meta.facetId) !== -1) {
            const input = this.searchModel.getInputByFacetId(section._meta.facetId);
            input.update();
            const inputOutput = input.getOutput();
            section.inputs = Array.isArray(inputOutput) ? inputOutput : [inputOutput];
          }
        });
      });
  }

  public getRequestParams = () => this.searchModel.getRequestParams();

  public filtersAsQueryParams = (filters) => this.searchModel.filtersAsQueryParams(filters);

  public updateFiltersFromQueryParams = (queryParams) => {
    this.searchModel.updateFiltersFromQueryParams(queryParams);
  };

  public getInputByFacetId = (facetId) => this.searchModel.getInputByFacetId(facetId);

  public filterTarget = (target) => {
    this.searchModel.filterTarget(target);
  };

  public updateInputsFromFilters = () => {
    this.searchModel.updateInputsFromFilters();
  };

  private _getSectionClasses(type) {
    const classesMap = {
      text: 'text',
      checkbox: 'checkboxes',
      link: 'links',
      select: 'select',
    };

    return `n7-facet__section-input-${classesMap[type]}`;
  }

  private _headerConfig(header, groupId) {
    return header ? {
      text: header.label,
      iconRight: HEADER_ICON_OPEN,
      classes: header.classes,
      payload: {
        source: 'group-header',
        id: `${groupId}-header`,
        groupId,
      },
      _meta: {
        id: `${groupId}-header`,
      },
    } : null;
  }
}
