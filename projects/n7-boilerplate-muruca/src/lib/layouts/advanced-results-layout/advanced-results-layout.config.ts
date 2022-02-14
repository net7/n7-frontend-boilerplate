import { SmartPaginationDS, SmartPaginationEH } from '@net7/boilerplate-common';
import { MrAdvancedResultsLayoutDS } from './advanced-results-layout.ds';
import { MrAdvancedResultsLayoutEH } from './advanced-results-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrAdvancedResultsLayoutConfig = {
  layoutId: 'mr-advanced-results-layout',
  widgets: [
    {
      id: 'mr-search-page-title'
    }, {
      id: 'mr-search-results-title'
    }, {
      id: 'mr-search-results'
    }, {
      id: 'n7-smart-pagination',
      dataSource: SmartPaginationDS,
      eventHandler: SmartPaginationEH,
    }, {
      id: 'mr-advanced-search-tags'
    }
  ],
  layoutDS: MrAdvancedResultsLayoutDS,
  layoutEH: MrAdvancedResultsLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
