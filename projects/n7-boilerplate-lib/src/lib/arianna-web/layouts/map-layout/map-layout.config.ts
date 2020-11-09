import { AwMapLayoutDS } from './map-layout.ds';
import { AwMapLayoutEH } from './map-layout.eh';
import { SmartPaginationDS } from '../../../common/data-sources';
import { SmartPaginationEH } from '../../../common/event-handlers';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwMapLayoutConfig = {
  layoutId: 'aw-map-layout',
  widgets: [ // array of components of this layout
    { id: 'aw-map' },
    { id: 'aw-scheda-inner-title' },
    { id: 'aw-linked-objects' },
    {
      id: 'n7-smart-pagination',
      dataSource: SmartPaginationDS,
      eventHandler: SmartPaginationEH,
    }
  ],
  layoutDS: AwMapLayoutDS,
  layoutEH: AwMapLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
