import { LayoutDataSource, _t } from '@n7-frontend/core';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MainStateService } from '../../../common/services/main-state.service';
import { MrSearchService } from '../../services/search.service';

export class MrSearchLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private mainState: MainStateService;

  private configId: string;

  public searchService: MrSearchService;

  public facetsConfig;

  public pageConfig;

  public totalResultsText: string | null = null;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
    this.searchService = payload.searchService;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    // config
    this.all().updateOptions({ config: this.pageConfig });

    // manual updates
    this.one('mr-search-page-title').update({});

    // update head title
    this.updateHeadTitle();

    // update translations
    this.addTranslations(this.pageConfig);
  }

  handleResponse(response) {
    this.some([
      'mr-search-results-title',
      'mr-search-results',
    ]).update(response);

    // pagination
    this.one('n7-smart-pagination').updateOptions({ mode: 'payload' });
    this.one('n7-smart-pagination').update(this.getPaginationParams(response));
  }

  updateActiveFilters(state, linksResponse) {
    // active "tags" filters
    this.one('mr-search-tags').update({
      state,
      linksResponse,
      facetsConfig: this.searchService.getConfig().facets
    });
  }

  private getPaginationParams(response) {
    const { total_count: totalCount, offset, limit } = response;
    const { pagination: paginationConfig } = this.pageConfig;

    return {
      totalPages: Math.ceil(totalCount / limit),
      currentPage: (offset + limit) / limit,
      pageLimit: paginationConfig.limit,
      sizes: {
        label: paginationConfig.selectLabel ? _t(paginationConfig.selectLabel) : null,
        list: paginationConfig.options,
        active: limit,
      },
    };
  }

  private updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle)].join(' > '));
  }

  private addTranslations(config) {
    if (config.facetsTitle) {
      config.facetsTitle = _t(config.facetsTitle);
    }
    if (config.filtersTitle) {
      config.filtersTitle = _t(config.filtersTitle);
    }
    if (config?.sort?.label) {
      config.sort.label = _t(config.sort.label);
      config.sort.options = config.sort.options.map((option) => ({
        ...option,
        label: _t(option.label)
      }));
    }
    ['text', 'button'].forEach((key) => {
      if (config.fallback) {
        config.fallback[key] = _t(config.fallback[key]);
      }
      if (config.ko) {
        config.ko[key] = _t(config.ko[key]);
      }
    });
  }
}
