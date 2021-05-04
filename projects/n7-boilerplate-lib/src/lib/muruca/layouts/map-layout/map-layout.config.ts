import { MrMapLayoutDS } from './map-layout.ds';
import { MrMapLayoutEH } from './map-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrMapLayoutConfig = {
  layoutId: 'mr-map-layout',
  widgets: [
    { id: 'mr-map' },
    { id: 'mr-year-header' }
  ],
  layoutDS: MrMapLayoutDS,
  layoutEH: MrMapLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {},
};
