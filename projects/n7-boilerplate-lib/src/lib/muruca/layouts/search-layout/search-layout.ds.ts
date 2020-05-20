import { LayoutDataSource } from '@n7-frontend/core';
import facetsConfig from './search-config.mock';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { MrSearchService } from '../../services/search.service';

type SectionStates = 'LOADING' | 'EMPTY' | 'OK' | 'KO';

export class MrSearchLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private configId: string;


  public searchService: MrSearchService;

  public state: {
    [key: string]: any;
  } = {};

  public sectionState: {
    [key: string]: SectionStates;
  } = {};

  public facetsConfig;

  public pageConfig;

  public totalResultsText: string | null = null;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.searchService = payload.searchService;
    this.facetsConfig = facetsConfig;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    // config
    this.all().updateOptions({ config: this.pageConfig });

    // manual updates
    this.one('mr-search-page-title').update({});
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

  updateActiveFilters() {
    // active "tags" filters
    this.one('mr-search-tags').update({
      state: this.state,
      facetsConfig: this.facetsConfig
    });
  }

  private getPaginationParams(response) {
    const { totalCount, page } = response;
    const { pagination: paginationConfig } = this.pageConfig;

    return {
      totalPages: Math.ceil(totalCount / page.limit),
      currentPage: page.current,
      pageLimit: paginationConfig.limit,
      sizes: {
        list: paginationConfig.options,
        active: page.limit,
      },
    };
  }

  setSectionState(id: string, newState: SectionStates) {
    this.sectionState[id] = newState;
  }
}
