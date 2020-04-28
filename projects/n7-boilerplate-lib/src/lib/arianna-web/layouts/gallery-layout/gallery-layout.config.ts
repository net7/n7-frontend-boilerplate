import { AwGalleryLayoutDS } from './gallery-layout.ds';
import { AwGalleryLayoutEH } from './gallery-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';
import { FacetsWrapperDS, SmartPaginationDS } from '../../../common/data-sources';
import { FacetsWrapperEH, SmartPaginationEH } from '../../../common/event-handlers';

export const AwGalleryLayoutConfig = {
  layoutId: 'aw-gallery-layout',
  /**
   * Array of components you want to use
   * in this layout
   */
  widgets: [
    { id: 'facets-wrapper', dataSource: FacetsWrapperDS, eventHandler: FacetsWrapperEH },
    { id: 'aw-linked-objects' },
    { id: 'aw-search-layout-tabs', hasStaticData: true },
    {
      id: 'n7-smart-pagination',
      dataSource: SmartPaginationDS,
      eventHandler: SmartPaginationEH,
    },
  ],
  layoutDS: AwGalleryLayoutDS,
  layoutEH: AwGalleryLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
