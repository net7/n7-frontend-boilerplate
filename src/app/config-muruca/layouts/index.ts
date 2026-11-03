/* eslint-disable camelcase */
import advancedResultsConfig from './advanced-results.config';
import advancedSearchConfig from './advanced-search.config';
import advancedSearchFullConfig from './advanced-search-full.config';
import homeConfig from './home.config';
import networkConfig from './network-config';
import postsConfig from './posts.config';
import resourceBookConfig from './resource-book.config';
import resourceKeywordConfig from './resource-keyword.config';
// import resourceModalBibliography_witConfig from './resource-modal-bibliography_wit.config';
import resourceToponymConfig from './resource-toponym.config';
import resourceWitnessConfig from './resource-witness.config';
import resourceWorkConfig from './resource-work.config';
import searchActsConfig from './search-acts.config';
import searchBooksConfig from './search-books.config';
import searchWitnessesConfig from './search-witnesses.config';
import searchWorksConfig from './search-works.config';
import itineraryConfig from './itinerary.config';
import timelineConfig from './timeline.config';
import mapConfig from './map.config';

// Metadata Dynamic Accordion (sls Theatheor/Auteso con mock resource)
import tabsConfig from './tabs.config';
import resourceWorkDatosBibliograficosConfig from './resource-work-datos-bibliograficos.config';
import resourceWorkDatosCodicologicosConfig from './resource-work-datos-codicologicos.config';

export default {
  home: homeConfig,
  network: networkConfig,
  posts: postsConfig,
  itinerary: itineraryConfig,
  timeline: timelineConfig,
  map: mapConfig,
  'advanced-results': advancedResultsConfig,
  'advanced-search-full': advancedSearchFullConfig,
  'advanced-search': advancedSearchConfig,
  'resource-book': resourceBookConfig,
  'resource-keyword': resourceKeywordConfig,
  // 'resource-modal-bibliography_wit': resourceModalBibliography_witConfig,
  'resource-toponym': resourceToponymConfig,
  'resource-witness': resourceWitnessConfig,
  'resource-work': resourceWorkConfig,
  'search-acts': searchActsConfig,
  'search-books': searchBooksConfig,
  'search-witnesses': searchWitnessesConfig,
  'search-works': searchWorksConfig,

  // Metadata Dynamic Accordion (sls Theatheor/Auteso con mock resource)
  tabs: tabsConfig,
  'resource-work-datos-bibliograficos': resourceWorkDatosBibliograficosConfig,
  'resource-work-datos-codicologicos': resourceWorkDatosCodicologicosConfig,
};
