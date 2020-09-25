import { SbExampleLayoutDS } from './example-layout.ds';
import { SbExampleLayoutEH } from './example-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const SbExampleLayoutConfig = {
  layoutId: 'sb-example-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [
  ],
  layoutDS: SbExampleLayoutDS,
  layoutEH: SbExampleLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
