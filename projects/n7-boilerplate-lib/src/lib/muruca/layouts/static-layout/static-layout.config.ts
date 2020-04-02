import { MrStaticLayoutDS } from './static-layout.ds';
import { MrStaticLayoutEH } from './static-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrStaticLayoutConfig = {
  layoutId: 'n7-static-layout',
  widgets: [
    // {
    //   id: 'title',          ← Insert a component here.
    //   hasStaticData: true,  ← Renders the widget before this.one().update is called.
    // }
  ],
  layoutDS: MrStaticLayoutDS,
  layoutEH: MrStaticLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
