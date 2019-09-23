import { AwPatrimonioLayoutDS } from './patrimonio-layout.ds';
import { AwPatrimonioLayoutEH } from './patrimonio-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwPatrimonioLayoutConfig = {
  layoutId: 'aw-patrimonio-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [
     { id: 'aw-sidebar-header'},
     { id: 'aw-tree' }
  ],
  layoutDS: AwPatrimonioLayoutDS,
  layoutEH: AwPatrimonioLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};