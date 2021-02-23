import { MrPostsLayoutDS } from './posts-layout.ds';
import { MrPostsLayoutEH } from './posts-layout.eh';
import { SmartPaginationDS } from '../../../common/data-sources';
import { SmartPaginationEH } from '../../../common/event-handlers';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrPostsLayoutConfig = {
  layoutId: 'mr-posts-layout',
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
  layoutDS: MrPostsLayoutDS,
  layoutEH: MrPostsLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
