import { AwAboutLayoutDS } from './about-layout.ds';
import { AwAboutLayoutEH } from './about-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export default {
  layoutId: 'aw-about-layout',
  widgets: [],
  layoutDS: AwAboutLayoutDS,
  layoutEH: AwAboutLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  layoutOptions: {
    // TODO
  }
};