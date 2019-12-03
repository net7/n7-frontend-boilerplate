import { DvHomeLayoutDS } from './home-layout.ds';
import { DvHomeLayoutEH } from './home-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const DvHomeLayoutConfig = {
  layoutId: 'dv-nav-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [
    {id: "dv-home-inner-title", hasStaticData: true},
    {id: "dv-nav", hasStaticData: true},
    {id: "dv-inner-title", hasStaticData: true},
    {id: "dv-widget", hasStaticData: true},
    {id: "dv-graph", hasStaticData: true},
  ],
  layoutDS: DvHomeLayoutDS,
  layoutEH: DvHomeLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};