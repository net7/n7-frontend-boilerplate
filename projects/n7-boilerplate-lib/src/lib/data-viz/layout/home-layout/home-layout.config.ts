import { DvHomeLayoutDS } from './home-layout.ds';
import { DvHomeLayoutEH } from './home-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const DvHomeLayoutConfig = {
  layoutId: 'dv-example-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [

  ],
  layoutDS: DvHomeLayoutDS,
  layoutEH: DvHomeLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};