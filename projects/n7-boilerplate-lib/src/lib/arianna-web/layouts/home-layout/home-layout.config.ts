import { AwHomeLayoutDS } from './home-layout.ds';
import { AwHomeLayoutEH } from './home-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwHomeLayoutConfig = {
  layoutId: 'aw-home-layout',
  widgets: [{
    id: 'aw-hero',
  }, {
    id: 'aw-home-hero-patrimonio',
    hasStaticData: true
  }, {
    id: 'aw-home-bubble-chart',
  }, {
    id: 'aw-home-facets-wrapper',
  }, {
    id: 'aw-home-item-preview-wrapper'
  }],
  layoutDS: AwHomeLayoutDS,
  layoutEH: AwHomeLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};