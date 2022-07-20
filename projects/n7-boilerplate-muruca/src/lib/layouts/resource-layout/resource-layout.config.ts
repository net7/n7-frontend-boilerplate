import { MrResourceLayoutDS } from './resource-layout.ds';
import { MrResourceLayoutEH } from './resource-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrResourceLayoutConfig = {
  layoutId: 'mr-resource-layout',
  widgets: [
    { id: 'mr-read-more' },
    { id: 'mr-metadata-readmore' }
  ],
  layoutDS: MrResourceLayoutDS,
  layoutEH: MrResourceLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
