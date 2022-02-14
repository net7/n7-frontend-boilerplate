import { SearchFacetsLayoutDS } from './search-facets-layout.ds';
import { SearchFacetsLayoutEH } from './search-facets-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const SearchFacetsLayoutConfig = {
  layoutId: 'mr-search-facets-layout',
  widgets: [],
  layoutDS: SearchFacetsLayoutDS,
  layoutEH: SearchFacetsLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
