import { DataSource } from '@n7-frontend/core';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AwSearchModel } from '../search/aw-search.model';

const HEADER_ICON_OPEN = 'n7-icon-angle-down';
const HEADER_ICON_CLOSE = 'n7-icon-angle-right';

export class AwFacetsWrapperDS extends DataSource {
  public searchModel: AwSearchModel;

  public paginate$: Subject<void> = new Subject();

  public paginationState = {} as any;

  protected transform(data) {
    if (!this.searchModel) {
      this.searchModel = data.searchModel;
      this.initPaginationState();
      this.initPaginationListener();
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

    // remove control
    if (Array.isArray(filterValue)) {
      remove = filterValue.indexOf(value) !== -1;
    } else {
      remove = filterValue === value;
    }

    // input text control
    // TODO: gestire i casi enter / icon click nel input text
    if (source === 'input-text' && ['enter', 'icon'].indexOf(trigger) !== -1) return;

    this.searchModel.updateFilter(facetId, value, remove);
    this.searchModel.updateInputsFromFilters();
  }

  public updateFilteredTarget(target) {
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
  }

  public getInputByFacetId = (facetId) => this.searchModel.getInputByFacetId(facetId);

  public filterTarget = (target) => {
    this.searchModel.filterTarget(target);
  }

  public updateInputsFromFilters = () => {
    this.searchModel.updateInputsFromFilters();
  }

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

  private initPaginationState() {
    this.searchModel.getFilters().filter((filter) => (
      filter.pagination
    )).forEach(({ pagination }) => {
      this.paginationState = {
        ...pagination,
        loading: false
      };
    });
  }

  private initPaginationListener() {
    setTimeout(() => {
      const scrollEl = document.querySelector('.n7-facets-wrapper__group-aw-search-layout-1 .n7-facet__section-input-links');
      const scroll$ = fromEvent(scrollEl, 'scroll');
      scroll$.pipe(
        debounceTime(300)
      ).subscribe(({ target }) => {
        const { scrollTop, clientHeight, scrollHeight } = target as HTMLElement;
        const {
          offset, limit, totalCount, loading
        } = this.paginationState;
        const margin = 150;
        if (
          (scrollTop + clientHeight >= scrollHeight - margin)
          && (offset + limit < totalCount)
          && loading === false
        ) {
          this.paginationState.loading = true;
          this.paginationState.offset = offset + limit;
        }
      });
    }, 100);
  }
}
