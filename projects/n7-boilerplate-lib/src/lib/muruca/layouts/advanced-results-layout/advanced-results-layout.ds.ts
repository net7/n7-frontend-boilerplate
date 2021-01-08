import { LayoutDataSource, _t } from '@n7-frontend/core';
import { Observable, of } from 'rxjs';
import { ConfigurationService } from '../../../common/services/configuration.service';
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

  protected mainState: MainStateService;

  protected configId: string;

  public pageConfig;

  onInit(payload) {
    this.configuration = payload.configuration;
    this.mainState = payload.mainState;
    this.configId = payload.configId;
    this.pageConfig = this.configuration.get(this.configId);

    // update head title
    this.updateHeadTitle();
  }

  request$(params): Observable<any> {
    // FIXME: connect API
    console.warn('FIXME: API', params);

    return of(RESPONSE_MOCK);
  }

  updateResults(response) {
    console.warn('FIXME: results', response);
  }

  protected updateHeadTitle() {
    const appName = this.configuration.get('name');
    const pageTitle = this.pageConfig.title;
    this.mainState.update('headTitle', [appName, _t(pageTitle)].join(' > '));
  }
}
