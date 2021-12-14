import { DvCardExampleLayoutDS } from './card-example-layout.ds';
import { DvCardExampleLayoutEH } from './card-example-layout.eh';

export const DvCardExampleLayoutConfig = {
  layoutId: 'dv-card-example-layout',
  // widgets added dinamically
  widgets: [],
  layoutDS: DvCardExampleLayoutDS,
  layoutEH: DvCardExampleLayoutEH,
  widgetsDataSources: {},
  widgetsEventHandlers: {},
  options: {},
};
