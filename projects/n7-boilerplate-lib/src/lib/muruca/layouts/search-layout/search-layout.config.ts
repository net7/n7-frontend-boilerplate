import { MrSearchLayoutDS } from './search-layout.ds';
import { MrSearchLayoutEH } from './search-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrSearchLayoutConfig = {
  layoutId: 'n7-search-layout',
  widgets: [
    // {
    //   id: 'title',          ← Insert a component here.
    //   hasStaticData: true,  ← Renders the widget before this.one().update is called.
    // }
  ],
  layoutDS: MrSearchLayoutDS,
  layoutEH: MrSearchLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
