import { LayoutDataSource, _t } from '@n7-frontend/core';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
import { CommunicationService } from '../../../common/services/communication.service';
import { MainStateService } from '../../../common/services/main-state.service';

const RESPONSE_MOCK = {
  limit: 12,
  offset: 0,
  sort: 'sort_ASC',
  // eslint-disable-next-line @typescript-eslint/camelcase
  total_count: 2,
  results: [{
    title: 'Città del Vaticano, Biblioteca Apostolica Vaticana, Vat. lat. 2193', text: null, metadata: [{ items: [{ label: 'data', value: '1330-1340' }, { label: 'origine', value: 'Italia (Verona)\n' }, { label: null }] }], image: null, id: 180, link: '/libro/180/citta-del-vaticano-biblioteca-apostolica-vaticana-lat-2193'
  }, {
    title: 'Città del Vaticano, Biblioteca Apostolica Vaticana, Lat. 3199', text: null, metadata: [{ items: [{ label: 'data', value: '1340 ca.' }, { label: 'origine', value: 'Italia (Firenze?)\n' }, { label: null }] }], image: null, id: 563, link: '/libro/563/citta-del-vaticano-biblioteca-apostolica-vaticana-lat-3199'
  }]
};

export class MrAdvancedResultsLayoutDS extends LayoutDataSource {
  protected configuration: ConfigurationService;

  protected communication: CommunicationService;

  protected mainState: MainStateService;

  protected configId: string;

  public pageConfig;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
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

  request$(params, onError): Observable<any> {
    // FIXME: connect API
    // return this.communication.request$('advancedSearch', { params, onError });
    console.warn('FIXME: connect API', params, onError);

    return of(RESPONSE_MOCK);
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
