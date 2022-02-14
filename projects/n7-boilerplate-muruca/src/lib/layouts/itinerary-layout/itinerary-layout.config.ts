import { MrItineraryLayoutDS } from './itinerary-layout.ds';
import { MrItineraryLayoutEH } from './itinerary-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrItineraryLayoutConfig = {
  layoutId: 'mr-itinerary-layout',
  widgets: [
    { id: 'mr-static-metadata' }
  ],
  layoutDS: MrItineraryLayoutDS,
  layoutEH: MrItineraryLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
