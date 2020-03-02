import { MainLayoutDS } from './main-layout.ds';
import { MainLayoutEH } from './main-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MainLayoutConfig = {
  layoutId: 'main-layout',
  widgets: [{
    id: 'header',
  }, {
    id: 'subnav',
  }, {
    id: 'breadcrumbs',
  }, {
    id: 'footer',
  }],
  layoutDS: MainLayoutDS,
  layoutEH: MainLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
