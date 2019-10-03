import { AwHomeLayoutDS } from './home-layout.ds';
import { AwHomeLayoutEH } from './home-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwHomeLayoutConfig = {
  layoutId: 'aw-home-layout',
  widgets: [{
    id: 'aw-hero',
  }, {
    id: 'aw-home-hero-patrimonio'
  }, {
    id: 'aw-home-bubble-chart',
  }, {
    id: 'aw-home-facets-wrapper',
  }, {
    id: 'aw-home-item-tags-wrapper',
  }, {
    id: 'aw-home-item-preview-wrapper'
  }, {
    id: 'aw-home-autocomplete',
    hasStaticData: true
  }],
  layoutDS: AwHomeLayoutDS,
  layoutEH: AwHomeLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};