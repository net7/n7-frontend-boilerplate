import { AwHomeLayoutDS } from './home-layout.ds';
import { AwHomeLayoutEH } from './home-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwHomeLayoutConfig = {
  layoutId: 'aw-home-layout',
  widgets: [{
    id: 'aw-carousel',
  }, {
    id: 'aw-hero',
  }, {
    id: 'aw-home-hero-patrimonio',
  }, {
    id: 'aw-bubble-chart',
  }, {
    id: 'aw-home-facets-wrapper',
  }, {
    id: 'aw-home-item-tags-wrapper',
  }, {
    id: 'aw-home-autocomplete',
  }, {
    id: 'aw-linked-objects',
  }, {
    id: 'aw-autocomplete-wrapper',
  }, {
    id: 'aw-chart-tippy',
  }],
  layoutDS: AwHomeLayoutDS,
  layoutEH: AwHomeLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
