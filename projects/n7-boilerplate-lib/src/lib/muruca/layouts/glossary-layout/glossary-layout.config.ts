import { MrGlossaryLayoutDS } from './glossary-layout.ds';
import { MrGlossaryLayoutEH } from './glossary-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const MrGlossaryLayoutConfig = {
  layoutId: 'n7-glossary-layout',
  widgets: [
    // {
    //   id: 'title',          ← Insert a component here.
    //   hasStaticData: true,  ← Renders the widget before this.one().update is called.
    // }
  ],
  layoutDS: MrGlossaryLayoutDS,
  layoutEH: MrGlossaryLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {}
};
