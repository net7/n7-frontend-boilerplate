import { MrStaticLayoutDS } from './static-layout.ds';
import { MrStaticLayoutEH } from './static-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrStaticLayoutConfig = {
  layoutId: 'mr-static-layout',
  widgets: [{
    id: 'mr-static-metadata'
  }],
  layoutDS: MrStaticLayoutDS,
  layoutEH: MrStaticLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
