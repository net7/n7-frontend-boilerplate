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
  }],
  layoutDS: MrHomeLayoutDS,
  layoutEH: MrHomeLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
