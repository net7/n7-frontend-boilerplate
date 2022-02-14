import { SmartPaginationDS, SmartPaginationEH } from '@net7/boilerplate-common';
import { AwSearchLayoutDS } from './search-layout.ds';
import { AwSearchLayoutEH } from './search-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';
import { AwFacetsWrapperDS } from '../../data-sources';
import { AwFacetsWrapperEH } from '../../event-handlers';

export const AwSearchLayoutConfig = {
  layoutId: 'aw-search-layout',
  /**
   * Array of components you want to use
   * in this layout
   */
  widgets: [
    { id: 'facets-wrapper', dataSource: AwFacetsWrapperDS, eventHandler: AwFacetsWrapperEH },
    { id: 'aw-linked-objects' },
    { id: 'aw-search-layout-tabs', hasStaticData: true },
    {
      id: 'n7-smart-pagination',
      dataSource: SmartPaginationDS,
      eventHandler: SmartPaginationEH,
    },
  ],
  layoutDS: AwSearchLayoutDS,
  layoutEH: AwSearchLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
