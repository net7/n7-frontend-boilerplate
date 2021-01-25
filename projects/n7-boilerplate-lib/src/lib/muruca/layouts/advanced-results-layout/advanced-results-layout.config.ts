import { MrAdvancedResultsLayoutDS } from './advanced-results-layout.ds';
import { MrAdvancedResultsLayoutEH } from './advanced-results-layout.eh';
import { SmartPaginationDS } from '../../../common/data-sources';
import { SmartPaginationEH } from '../../../common/event-handlers';
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
    }
  ],
  layoutDS: MrAdvancedResultsLayoutDS,
  layoutEH: MrAdvancedResultsLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
