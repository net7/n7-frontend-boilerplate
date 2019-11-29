import { ExampleLayoutDS } from './example-layout.ds';
import { ExampleLayoutEH } from './example-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const ExampleLayoutConfig = {
  layoutId: 'dv-example-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [
    { id: 'dv-inner-title', hasStaticData: true },
  ],
  layoutDS: ExampleLayoutDS,
  layoutEH: ExampleLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};