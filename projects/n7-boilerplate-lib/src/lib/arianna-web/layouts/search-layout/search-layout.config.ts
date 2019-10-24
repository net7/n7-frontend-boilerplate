import { AwSearchLayoutDS } from './search-layout.ds';
import { AwSearchLayoutEH } from './search-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';
import { FacetsWrapperDS } from '../../../common/data-sources';
import { FacetsWrapperEH } from '../../../common/event-handlers';

export const AwSearchLayoutConfig = {
  layoutId: 'aw-search-layout',
  /**
   * Array of components you want to use
   * in this layout
   */
  widgets: [
    { id: 'facets-wrapper', dataSource: FacetsWrapperDS, eventHandler: FacetsWrapperEH },
    { id: 'aw-linked-objects' },
    { id: 'aw-search-layout-tabs', hasStaticData: true },
  ],
  layoutDS: AwSearchLayoutDS,
  layoutEH: AwSearchLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};
