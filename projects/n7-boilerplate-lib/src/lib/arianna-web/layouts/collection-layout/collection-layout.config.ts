import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';
import { AwCollectionLayoutDS } from './collection-layout.ds';
import { AwCollectionLayoutEH } from './collection-layout.eh';

export const AwCollectionLayoutConfig = {
  layoutId: 'aw-collection-layout',
  widgets: [ // array of components of this layout
  ],
  layoutDS: AwCollectionLayoutDS,
  layoutEH: AwCollectionLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
