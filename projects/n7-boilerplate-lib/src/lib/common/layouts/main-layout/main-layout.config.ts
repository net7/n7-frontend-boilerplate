import { MainLayoutDS } from './main-layout.ds';
import { MainLayoutEH } from './main-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export default {
  layoutId: 'main-layout',
  widgets: [{
    id: 'header'
  }],
  layoutDS: MainLayoutDS,
  layoutEH: MainLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {
    // TODO
  }
};