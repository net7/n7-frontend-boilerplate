/* eslint-disable @typescript-eslint/camelcase */
import advancedResultsConfig from './advanced-results.config';
import advancedSearchConfig from './advanced-search.config';
import advancedSearchFullConfig from './advanced-search-full.config';
import homeConfig from './home.config';
import postsConfig from './posts.config';
import resourceBookConfig from './resource-book.config';
import resourceKeywordConfig from './resource-keyword.config';
import resourceModalBibliography_witConfig from './resource-modal-bibliography_wit.config';
import resourceToponymConfig from './resource-toponym.config';
import resourceWitnessConfig from './resource-witness.config';
import resourceWorkConfig from './resource-work.config';
import searchBooksConfig from './search-books.config';
import searchWitnessesConfig from './search-witnesses.config';
import searchWorksConfig from './search-works.config';

export default {
  home: homeConfig,
  posts: postsConfig,
  'advanced-results': advancedResultsConfig,
  'advanced-search-full': advancedSearchFullConfig,
  'advanced-search': advancedSearchConfig,
  'resource-book': resourceBookConfig,
  'resource-keyword': resourceKeywordConfig,
  'resource-modal-bibliography_wit': resourceModalBibliography_witConfig,
  'resource-toponym': resourceToponymConfig,
  'resource-witness': resourceWitnessConfig,
  'resource-work': resourceWorkConfig,
  'search-books': searchBooksConfig,
  'search-witnesses': searchWitnessesConfig,
  'search-works': searchWorksConfig,
};
