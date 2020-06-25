import { AwMapLayoutDS } from './map-layout.ds';
import { AwMapLayoutEH } from './map-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwMapLayoutConfig = {
  layoutId: 'aw-map-layout',
  widgets: [ // array of components of this layout

  ],
  layoutDS: AwMapLayoutDS,
  layoutEH: AwMapLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
