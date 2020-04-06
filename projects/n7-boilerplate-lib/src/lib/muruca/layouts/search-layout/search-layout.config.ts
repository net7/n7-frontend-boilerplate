import { MrSearchLayoutDS } from './search-layout.ds';
import { MrSearchLayoutEH } from './search-layout.eh';
import { FacetsWrapperDS, SmartPaginationDS } from '../../../common/data-sources';
import { FacetsWrapperEH, SmartPaginationEH } from '../../../common/event-handlers';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrSearchLayoutConfig = {
  layoutId: 'mr-search-layout',
  widgets: [{
    id: 'facets-wrapper', dataSource: FacetsWrapperDS, eventHandler: FacetsWrapperEH
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
