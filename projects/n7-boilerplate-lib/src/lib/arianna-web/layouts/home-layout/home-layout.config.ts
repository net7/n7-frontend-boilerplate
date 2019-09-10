import { AwHomeLayoutDS } from './home-layout.ds';
import { AwHomeLayoutEH } from './home-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwHomeLayoutConfig = {
  layoutId: 'aw-home-layout',
  widgets: [{
    id: 'aw-table',
    hasStaticData: true
  }],
  layoutDS: AwHomeLayoutDS,
  layoutEH: AwHomeLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};