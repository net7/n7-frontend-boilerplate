import { MrHomeLayoutDS } from './home-layout.ds';
import { MrHomeLayoutEH } from './home-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrHomeLayoutConfig = {
  layoutId: 'mr-home-layout',
  widgets: [{
    id: 'mr-resources', dataSource: DS.MrItemPreviewsDS,
  }, {
    id: 'mr-collections', dataSource: DS.MrItemPreviewsDS,
  }, {
    id: 'mr-res-header', dataSource: DS.MrInnerTitleDS,
  }, {
    id: 'mr-coll-header', dataSource: DS.MrInnerTitleDS,
  }, {
    id: 'mr-hero', dataSource: DS.MrHeroDS,
  }],
  layoutDS: MrHomeLayoutDS,
  layoutEH: MrHomeLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
