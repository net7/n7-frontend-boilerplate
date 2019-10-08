import { AwSearchLayoutDS } from './search-layout.ds';
import { AwSearchLayoutEH } from './search-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';
import { FacetsDS } from '../../../common/data-sources';

export const AwSearchLayoutConfig = {
  layoutId: 'aw-search-layout',
  /**
   * Array of components you want to use
   * in this layout
   */
  widgets: [
    { id: 'facets', dataSource: FacetsDS }
  ],
  layoutDS: AwSearchLayoutDS,
  layoutEH: AwSearchLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};
