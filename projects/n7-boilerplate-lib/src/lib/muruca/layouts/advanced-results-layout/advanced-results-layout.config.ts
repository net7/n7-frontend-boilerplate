import { MrAdvancedResultsLayoutDS } from './advanced-results-layout.ds';
import { MrAdvancedResultsLayoutEH } from './advanced-results-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrAdvancedResultsLayoutConfig = {
  layoutId: 'mr-advanced-results-layout',
  widgets: [{
    id: 'mr-form-wrapper-accordion'
  }],
  layoutDS: MrAdvancedResultsLayoutDS,
  layoutEH: MrAdvancedResultsLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
