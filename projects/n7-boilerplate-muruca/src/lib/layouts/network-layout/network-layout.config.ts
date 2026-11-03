import { MrNetworkLayoutDS } from './network-layout.ds';
import { MrNetworkLayoutEH } from './network-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrNetworkLayoutConfig = {
  layoutId: 'mr-network-layout',
  widgets: [],
  layoutDS: MrNetworkLayoutDS,
  layoutEH: MrNetworkLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
  },
};
