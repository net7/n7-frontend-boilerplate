import { AwTimelineLayoutDS } from './timeline-layout.ds';
import { AwTimelineLayoutEH } from './timeline-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwTimelineLayoutConfig = {
  layoutId: 'aw-timeline-layout',
  widgets: [ // array of components of this layout
    { id: 'aw-timeline', hasStaticData: true },
    { id: 'aw-scheda-inner-title' },
    { id: 'aw-linked-objects' }
  ],
  layoutDS: AwTimelineLayoutDS,
  layoutEH: AwTimelineLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
