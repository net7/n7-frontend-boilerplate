import { AwSchedaLayoutDS } from './scheda-layout.ds';
import { AwSchedaLayoutEH } from './scheda-layout.eh';
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
     { id: 'aw-scheda-breadcrumbs' },
     { id: 'aw-scheda-metadata' },
     { id: 'aw-scheda-image' },
     { id: 'aw-scheda-inner-title' },
     { id: 'aw-scheda-bubble-chart' },
     { id: 'aw-linked-objects' }
  ],
  layoutDS: AwSchedaLayoutDS,
  layoutEH: AwSchedaLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};
