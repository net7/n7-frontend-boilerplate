import { AwWorksLayoutDS } from './works-layout.ds';
import { AwWorksLayoutEH } from './works-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwWorksLayoutConfig = {
  layoutId: 'aw-works-layout',
  widgets: [],
  layoutDS: AwWorksLayoutDS,
  layoutEH: AwWorksLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {
    // TODO
  }
};