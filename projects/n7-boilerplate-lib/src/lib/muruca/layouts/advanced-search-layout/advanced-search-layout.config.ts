import { MrAdvancedSearchLayoutDS } from './advanced-search-layout.ds';
import { MrAdvancedSearchLayoutEH } from './advanced-search-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrAdvancedSearchLayoutConfig = {
  layoutId: 'mr-advanced-search-layout',
  widgets: [{
    id: 'mr-form-wrapper-accordion'
  }],
  layoutDS: MrAdvancedSearchLayoutDS,
  layoutEH: MrAdvancedSearchLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
