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
    { id: 'aw-sidebar-header' },
    { id: 'aw-tree' },
    { id: 'aw-scheda-breadcrumbs' },
    { id: 'aw-scheda-metadata' },
    { id: 'aw-scheda-dropdown' },
    { id: 'aw-scheda-image' },
    { id: 'aw-scheda-pdf' },
    { id: 'aw-scheda-inner-title' },
    { id: 'aw-related-entities' },
    { id: 'aw-chart-tippy' },
    { id: 'aw-linked-objects' },
    { id: 'aw-extended-tree' },
  ],
  layoutDS: AwSchedaLayoutDS,
  layoutEH: AwSchedaLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
