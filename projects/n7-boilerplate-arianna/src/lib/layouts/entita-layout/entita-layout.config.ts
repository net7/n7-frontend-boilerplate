import { SmartPaginationDS, SmartPaginationEH } from '@net7/boilerplate-common';
import { AwEntitaLayoutDS } from './entita-layout.ds';
import { AwEntitaLayoutEH } from './entita-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwEntitaLayoutConfig = {
  layoutId: 'aw-entita-layout',
  widgets: [ // array of components of this layout
    { id: 'aw-entita-nav', hasStaticData: true },
    { id: 'aw-entita-metadata-viewer' },
    { id: 'aw-linked-objects' },
    { id: 'aw-bubble-chart' },
    { id: 'aw-related-entities' },
    { id: 'aw-chart-tippy' },
    {
      id: 'n7-smart-pagination',
      dataSource: SmartPaginationDS,
      eventHandler: SmartPaginationEH,
    },
  ],
  layoutDS: AwEntitaLayoutDS,
  layoutEH: AwEntitaLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
