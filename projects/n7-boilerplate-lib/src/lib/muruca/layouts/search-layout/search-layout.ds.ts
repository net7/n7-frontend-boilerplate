import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { LayoutDataSource } from '@n7-frontend/core';
import facetsConfig from './search-facets.config';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import resultsMock from './search-layout.mock';

export class MrSearchLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private configId: string;

  public state = {};

  public facetsConfig;

  public pageConfig;

  public totalResultsText: string | null = null;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.communication = payload.communication;
    this.facetsConfig = facetsConfig;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    // config
    this.all().updateOptions({ config: this.pageConfig });

    // manual updates
    this.one('mr-search-page-title').update({});
  }

  doRequest$(params = {}) {
    // FIXME: togliere commento
    // return this.communication.request$('search', {});
    console.warn('#TODO: doRequest', params);
    return of(resultsMock(this.getState('page') || 1)).pipe(
      delay(5000)
    );
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

  getState(id?: string) {
    return id ? this.state[id] : this.state;
  }

  setState(id: string, value: any) {
    this.state[id] = value;
  }

  clearState() {
    this.state = {};
  }
}
