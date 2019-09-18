import { Page404LayoutDS } from './page404-layout.ds';
import { Page404LayoutEH } from './page404-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const Page404LayoutConfig = {
  layoutId: 'n7-page404-layout',
  widgets: [],
  layoutDS: Page404LayoutDS,
  layoutEH: Page404LayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};