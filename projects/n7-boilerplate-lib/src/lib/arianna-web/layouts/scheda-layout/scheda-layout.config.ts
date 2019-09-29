import { AwPatrimonioLayoutDS } from './scheda-layout.ds';
import { AwPatrimonioLayoutEH } from './scheda-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwPatrimonioLayoutConfig = {
  layoutId: 'aw-scheda-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [
     { id: 'aw-sidebar-header'},
     { id: 'aw-tree' },
     { id: 'aw-scheda-breadcrumbs' }
  ],
  layoutDS: AwPatrimonioLayoutDS,
  layoutEH: AwPatrimonioLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};