import { DvExampleLayoutDS } from './example-layout.ds';
import { DvExampleLayoutEH } from './example-layout.eh';
import * as DS from '../../data-source';
import * as EH from '../../event-handlers';

export const DvExampleLayoutConfig = {
    layoutId: 'dv-example-layout',
    widgets: [],
    layoutDS: DvExampleLayoutDS,
    layoutEH: DvExampleLayoutEH,
    widgetsDataSources: DS,
    widgetsEventHandlers: EH,
    layoutOptions: {
      // TODO
    }
  };