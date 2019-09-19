import { AwPatrimonioLayoutDS } from './patrimonio-layout.ds';
import { AwPatrimonioLayoutEH } from './patrimonio-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwPatrimonioLayoutConfig = {
  layoutId: 'n7-patrimonio-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [
     { id: 'aw-patrimonio-sidebar-header', 
   
    },
     { id: 'aw-patrimonio-sidebar-tree' },
  ],
  layoutDS: AwPatrimonioLayoutDS,
  layoutEH: AwPatrimonioLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};