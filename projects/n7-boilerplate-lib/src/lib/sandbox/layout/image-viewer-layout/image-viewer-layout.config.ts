import { SbImageViewerLayoutDS } from './image-viewer-layout.ds';
import { SbImageViewerLayoutEH } from './image-viewer-layout.eh';
import * as DS from '../../data-sources';
import * as EH from '../../event-handlers';

export const SbImageViewerLayoutConfig = {
  layoutId: 'sb-image-viewer-layout',
  /**
   * Array of components you want to use
   * in this leyout
   */
  widgets: [
    { id: 'sb-image-viewer-tools', hasStaticData: true },
    { id: 'sb-image-viewer', hasStaticData: true }
  ],
  layoutDS: SbImageViewerLayoutDS,
  layoutEH: SbImageViewerLayoutEH,
  widgetsDataSources: DS,
  widgetsEventHandlers: EH,
  options: {
    // TODO
  },
};
