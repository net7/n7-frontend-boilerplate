import { MrTimelineLayoutDS } from './timeline-layout.ds';
import { MrTimelineLayoutEH } from './timeline-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrTimelineLayoutConfig = {
  layoutId: 'mr-timeline-layout',
  widgets: [
    { id: 'mr-timeline' },
    { id: 'mr-map' }
  ],
  layoutDS: MrTimelineLayoutDS,
  layoutEH: MrTimelineLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
