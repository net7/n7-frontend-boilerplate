import { AwGalleryLayoutDS } from './gallery-layout.ds';
import { AwGalleryLayoutEH } from './gallery-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';
import { FacetsWrapperDS } from '../../../common/data-sources';
import { FacetsWrapperEH } from '../../../common/event-handlers';

export const AwGalleryLayoutConfig = {
  layoutId: 'aw-gallery-layout',
  widgets: [
    { id: 'facets-wrapper', dataSource: FacetsWrapperDS, eventHandler: FacetsWrapperEH },
    { id: 'aw-gallery-results' },
    // { id: 'aw-search-layout-tabs', hasStaticData: true },
  ],
  layoutDS: AwGalleryLayoutDS,
  layoutEH: AwGalleryLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};