import { of } from 'rxjs';
import { LayoutDataSource } from '@n7-frontend/core';
import facetsConfig from './search-facets.config';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import resultsMock from './search-layout.mock';

export class MrSearchLayoutDS extends LayoutDataSource {
  private configuration: ConfigurationService;

  private communication: CommunicationService;

  private configId: string;

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

    // first request
    this.doRequest$().subscribe((response) => {
      this.handleResponse(response);
    });
  }

  doRequest$() {
    // FIXME: togliere commento
    // return this.communication.request$('search', {});
    return of(resultsMock);
  }

  handleResponse(response) {
    this.some([
      'mr-search-results-title',
      'mr-search-results',
    ]).update(response);
    // this.one('mr-resources').updateOptions({ source: 'search' });
    // this.one('mr-resources').update({});
  }
}
