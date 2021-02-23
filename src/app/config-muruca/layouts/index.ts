/* eslint-disable @typescript-eslint/camelcase */
import homeConfig from './home.config';
import searchWorksConfig from './search-works.config';
import searchBooksConfig from './search-books.config';
import resourceBookConfig from './resource-book.config';
import resourceToponymConfig from './resource-toponym.config';
import resourceKeywordConfig from './resource-keyword.config';
import resourceWorkConfig from './resource-work.config';
import resourceWitnessConfig from './resource-witness.config';
import searchWitnessesConfig from './search-witnesses.config';
import resourceModalBibliography_witConfig from './resource-modal-bibliography_wit.config';
import advancedSearchConfig from './advanced-search.config';
import advancedSearchFullConfig from './advanced-search-full.config';
import advancedResultsConfig from './advanced-results.config';

export default {
  home: homeConfig,
  'search-works': searchWorksConfig,
  'search-books': searchBooksConfig,
  'search-witnesses': searchWitnessesConfig,
  'resource-work': resourceWorkConfig,
  'resource-book': resourceBookConfig,
  'resource-toponym': resourceToponymConfig,
  'resource-keyword': resourceKeywordConfig,
  'resource-witness': resourceWitnessConfig,
  'resource-modal-bibliography_wit': resourceModalBibliography_witConfig,
  'advanced-search': advancedSearchConfig,
  'advanced-search-full': advancedSearchFullConfig,
  'advanced-results': advancedResultsConfig
};
