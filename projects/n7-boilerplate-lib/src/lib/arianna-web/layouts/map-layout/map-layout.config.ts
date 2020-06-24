import { MAP_MOCK } from '@n7-frontend/components';
import { AwMapLayoutDS } from './map-layout.ds';
import { AwMapLayoutEH } from './map-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwMapLayoutConfig = {
  layoutId: 'aw-map-layout',
  widgets: [
    { id: 'map', hasStaticData: true, dataSource: MAP_MOCK }
  ],
  layoutDS: AwMapLayoutDS,
  layoutEH: AwMapLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {}
};
