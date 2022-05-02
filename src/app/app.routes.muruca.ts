import { Routes } from '@angular/router';

import { Page404LayoutComponent } from '@net7/boilerplate-common';
import {
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrResourceLayoutComponent,
  MrAdvancedSearchLayoutComponent,
  MrAdvancedResultsLayoutComponent,
  MrItineraryLayoutComponent,
  MrPostsLayoutComponent,
  MrTimelineLayoutComponent,
  MrMapLayoutComponent,
  LocaleDependenciesGuard,
  // DynamicPathGuard,
} from '@net7/boilerplate-muruca';

const NOT_FOUND_PATH = 'page-404';

type RouteConfig = {
  component?: any;
  paths: {
    [locale: string]: string;
  };
  data?: any;
  isRedirect?: boolean;
}
// pathMatch: 'full'
const config: {
  [layoutID: string]: RouteConfig
} = {
  works: {
    component: MrSearchLayoutComponent,
    paths: {
      it: 'opere',
      en: 'en/works'
    },
    data: { configId: 'search-works' },
  },
  atti: {
    component: MrSearchLayoutComponent,
    paths: {
      it: 'atti',
      en: 'en/acts'
    },
    data: { configId: 'search-acts' },
  },
  books: {
    component: MrSearchLayoutComponent,
    paths: {
      it: 'biblioteca',
      en: 'en/books'
    },
    data: { configId: 'search-books' },
  },
  work: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'opera/:id/:slug',
      en: 'en/work/:id/:slug'
    },
    data: { configId: 'resource-work' }
  },
  book: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'libro/:id/:slug',
      en: 'en/book/:id/:slug'
    },
    data: { configId: 'resource-book' }
  },
  toponym: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'toponimo/:id/:slug',
      en: 'en/toponym/:id/:slug'
    },
    data: { configId: 'resource-toponym' }
  },
  keyword: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'parola-chiave/:id/:slug',
      en: 'en/keyword/:id/:slug'
    },
    data: { configId: 'resource-keyword' }
  },
  witness: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'testimone/:id/:slug',
      en: 'en/witness/:id/:slug'
    },
    data: { configId: 'resource-witness' }
  },
  witnesses: {
    component: MrSearchLayoutComponent,
    paths: {
      it: 'testimoni/:id/:slug',
      en: 'en/witnesses/:id/:slug'
    },
    data: { configId: 'search-witnesses' },
  },
  timeline: {
    component: MrTimelineLayoutComponent,
    paths: {
      it: 'linea-del-tempo/:id',
      en: 'en/timeline/:id'
    },
    data: { configId: 'timeline' }
  },
  // FIXME
  timelineRedirect: {
    paths: {
      it: 'linea-del-tempo',
      en: 'en/timeline'
    },
    isRedirect: true,
  },
  map: {
    component: MrMapLayoutComponent,
    paths: {
      it: 'mappa/:id/:slug',
      en: 'en/map/:id/:slug'
    },
    data: { configId: 'map' }
  },
  mapLanding: {
    component: MrMapLayoutComponent,
    paths: {
      it: 'mappa/:id',
      en: 'en/map/:id'
    },
    data: { configId: 'map' }
  },
  // FIXME
  mapRedirect: {
    paths: {
      it: 'mappa',
      en: 'en/map',
    },
    isRedirect: true,
  },
  posts: {
    component: MrPostsLayoutComponent,
    paths: {
      it: 'post',
      en: 'en/posts'
    },
    data: { configId: 'posts' }
  },
  post: {
    component: MrStaticLayoutComponent,
    paths: {
      it: 'post/:slug',
      en: 'en/posts/:slug',
    },
    data: { configId: 'post' }
  },
  advancedSearch: {
    component: MrAdvancedSearchLayoutComponent,
    paths: {
      it: 'ricerca-avanzata',
      en: 'en/advanced-search'
    },
    data: { configId: 'advanced-search' }
  },
  advancedSearchFull: {
    component: MrAdvancedResultsLayoutComponent,
    paths: {
      it: 'ricerca-avanzata-completa',
      en: 'en/advanced-search-full'
    },
    data: { configId: 'advanced-search-full' }
  },
  advancedSearchResults: {
    component: MrAdvancedResultsLayoutComponent,
    paths: {
      it: 'risultati-ricerca',
      en: 'en/advanced-results'
    },
    data: { configId: 'advanced-results' }
  },
  itinerary: {
    component: MrItineraryLayoutComponent,
    paths: {
      it: 'itinerario/:id/:slug',
      en: 'en/itinerary/:id/:slug'
    },
    data: { configId: 'itinerary' }
  },
  home: {
    component: MrHomeLayoutComponent,
    paths: {
      it: '',
      en: 'en/'
    },
    data: { configId: 'home' }
  },
  homeRedirect: {
    paths: {
      en: 'en',
    },
    isRedirect: true,
  },
};

const APP_ROUTES: Routes = [
  {
    path: 'home',
    redirectTo: '',
    pathMatch: 'full'
  },
];

/**
 * Generate angular routes from config
 */
Object.keys(config).forEach((routeId) => {
  const {
    component, data, paths, isRedirect
  } = config[routeId];
  Object.entries(paths).forEach(([locale, path]) => {
    // path to component
    if (component) {
      APP_ROUTES.push({
        path,
        component,
        data: { ...data, routeId, locale },
        canActivate: [LocaleDependenciesGuard]
      });
    }
    // catch route
    if (isRedirect) {
      APP_ROUTES.push(
        { path, redirectTo: `${path}/` }
      );
    }
  });
});

// default route handler
APP_ROUTES.push(
  {
    path: '**',
    component: MrStaticLayoutComponent,
    data: {
      notFoundPath: NOT_FOUND_PATH,
      locale: 'it'
    },
    canActivate: [LocaleDependenciesGuard]
  },
  {
    path: NOT_FOUND_PATH,
    component: Page404LayoutComponent,
    data: { id: 'page-404', locale: 'it' },
    canActivate: [LocaleDependenciesGuard]
  }
);

export { APP_ROUTES };
