import layouts from './layouts';
import header from './header.config';
import footer from './footer.config';
import communication from './communication.config';
import itemPreview from './item-preview.config';
import configKeys from './config-keys.config';
import bubbleChart from './bubble-chart.config';
import labels from '../config-muruca/labels.config';

export default {
  communication,
  header,
  footer,
  'bubble-chart': bubbleChart,
  'item-preview': itemPreview,
  'config-keys': configKeys,
  labels,
  ...layouts,

  // aditional config
  paths: {
    schedaBasePath: '/aw/patrimonio/',
    entitaBasePath: '/aw/entita/',
    searchBasePath: '/aw/ricerca/',
    galleryBasePath: '/aw/galleria/'
  },
  'features-enabled': {
    bubblechart: true
  },
};
