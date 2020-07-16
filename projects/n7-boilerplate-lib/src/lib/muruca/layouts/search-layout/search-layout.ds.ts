import { LayoutDataSource } from '@n7-frontend/core';
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
    const { total_count: totalCount, page, limit } = response;
    const { pagination: paginationConfig } = this.pageConfig;

    return {
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
      pageLimit: paginationConfig.limit,
      sizes: {
        list: paginationConfig.options,
        active: limit,
      },
    };
  }

  private updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, pageTitle].join(' > '));
  }
}
