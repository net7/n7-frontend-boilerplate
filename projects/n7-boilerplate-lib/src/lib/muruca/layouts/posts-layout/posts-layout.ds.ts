import { LayoutDataSource, _t } from '@n7-frontend/core';
import { Observable } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';

export class MrPostsLayoutDS extends LayoutDataSource {
  protected configuration: ConfigurationService;

  protected communication: CommunicationService;

  protected mainState: MainStateService;

  protected configId: string;

  public pageConfig;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.communication = payload.communication;
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

  updateSearchTags(params) {
    if (!this.pageConfig.filters) {
      return;
    }

    const { labels } = this.pageConfig.filters;
    const tags = [];
    Object.keys(labels)
      .filter((key) => !!params[key])
      .forEach((key) => {
        tags[key] = params[key];
      });

    this.one('mr-advanced-search-tags').updateOptions({ labels });
    this.one('mr-advanced-search-tags').update(tags);
  }

  request$(params, onError): Observable<any> {
    const { searchId } = this.pageConfig;
    Object.keys(params)
      .filter((key) => ['page', 'limit', 'sort'].includes(key))
      .forEach((key) => {
        params.results = params.results || {};
        params.results[key] = params[key];
        delete params[key];
      });
    return this.communication.request$('posts', {
      method: 'POST',
      params: {
        ...params,
        searchId,
        results: {
          offset: 0,
          limit: 12
        }
      },
      onError
    });
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

  protected updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle)].join(' > '));
  }

  private addTranslations(config) {
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

    // filters
    const { filters } = this.pageConfig;
    if (filters) {
      filters.title = _t(filters.title);
      Object.keys(filters.labels).forEach((key) => {
        filters.labels[key] = _t(filters.labels[key]);
      });
    }
  }

  protected getPaginationParams(response) {
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
}
