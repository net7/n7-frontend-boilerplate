import { AwTimelineLayoutDS } from './timeline-layout.ds';
import { AwTimelineLayoutEH } from './timeline-layout.eh';
import { SmartPaginationDS } from '../../../common/data-sources';
import { SmartPaginationEH } from '../../../common/event-handlers';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwTimelineLayoutConfig = {
  layoutId: 'aw-timeline-layout',
  widgets: [ // array of components of this layout
    { id: 'aw-timeline' },
    { id: 'aw-scheda-inner-title' },
    { id: 'aw-linked-objects' },
    {
      id: 'n7-smart-pagination',
      dataSource: SmartPaginationDS,
      eventHandler: SmartPaginationEH,
    }
  ],
  layoutDS: AwTimelineLayoutDS,
  layoutEH: AwTimelineLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
