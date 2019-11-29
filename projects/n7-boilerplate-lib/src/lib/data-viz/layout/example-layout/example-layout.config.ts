import { DvExampleLayoutDS } from './example-layout.ds';
import { DvExampleLayoutEH } from './example-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const DvExampleLayoutConfig = {
  layoutId: 'dv-example-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [
    { id: 'dv-inner-title', hasStaticData: true },
    { id: 'dv-widget', hasStaticData: true },
  ],
  layoutDS: DvExampleLayoutDS,
  layoutEH: DvExampleLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};