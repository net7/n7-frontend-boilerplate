import { AwEntitaLayoutDS } from './entita-layout.ds';
import { AwEntitaLayoutEH } from './entita-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const AwEntitaLayoutConfig = {
  layoutId: 'aw-entita-layout',
  /**
   * Array of components to use
   * in this layout
   */
  widgets: [
    // { id: 'header' },
    { id: 'aw-entita-nav', hasStaticData: true }
  ],
  layoutDS: AwEntitaLayoutDS,
  layoutEH: AwEntitaLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  }
};