import { SearchTestLayoutDS } from './search-test-layout.ds';
import { SearchTestLayoutEH } from './search-test-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const SearchTestLayoutConfig = {
  layoutId: 'mr-search-test-layout',
  widgets: [
    // TODO
  ],
  layoutDS: SearchTestLayoutDS,
  layoutEH: SearchTestLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
