import { SmartPaginationDS, SmartPaginationEH } from '@n7-frontend/boilerplate-common';
import { MrSearchLayoutDS } from './search-layout.ds';
import { MrSearchLayoutEH } from './search-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrSearchLayoutConfig = {
  layoutId: 'mr-search-layout',
  widgets: [{
    id: 'mr-search-page-title'
  }, {
    id: 'mr-search-page-description'
  }, {
    id: 'mr-search-results-title'
  }, {
    id: 'mr-search-results'
  }, {
    id: 'mr-search-tags'
  }, {
    id: 'mr-resources', dataSource: DS.MrItemPreviewsDS,
  }, {
    id: 'n7-smart-pagination',
    dataSource: SmartPaginationDS,
    eventHandler: SmartPaginationEH,
  }],
  layoutDS: MrSearchLayoutDS,
  layoutEH: MrSearchLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
