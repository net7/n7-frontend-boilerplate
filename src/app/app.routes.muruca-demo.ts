import { Routes } from '@angular/router';

import {
  // COMMON
  Page404LayoutComponent,
} from '@net7/boilerplate-common';
import {
  // MURUCA
  MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrResourceLayoutComponent,
  MrTimelineLayoutComponent,
  // OTHER
  MrItineraryLayoutComponent,
  MrMapLayoutComponent,
  LocaleDependenciesGuard,
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

const config: {
  [layoutID: string]: RouteConfig
} = {
  motifs: {
    component: MrSearchLayoutComponent,
    paths: {
      it: 'motivi',
      en: 'en/motifs'
    },
    data: { configId: 'search-motifs' },
  },
  motifsItem: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'motivi/:id/:slug',
      en: 'en/motifs/:id/:slug'
    },
    data: { configId: 'resource-motif' }
  },
  bibliography: {
    component: MrSearchLayoutComponent,
    paths: {
      it: 'bibliografia',
      en: 'en/bibliography'
    },
    data: { configId: 'search-bibliography' },
  },
  bibliographyItem: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'bibliografia/:id/:slug',
      en: 'en/bibliography/:id/:slug'
    },
    data: { configId: 'resource-bibliography' }
  },
  records: {
    component: MrSearchLayoutComponent,
    paths: {
      it: 'record',
      en: 'en/record'
    },
    data: { configId: 'search-records' },
  },
  recordsItem: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'record/:id/:slug',
      en: 'en/record/:id/:slug'
    },
    data: { configId: 'resource-record' }
  },
  record: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'record/:id/:slug',
      en: 'en/record/:id/:slug'
    },
    data: { configId: 'resource-record' }
  },
  timeline: {
    component: MrTimelineLayoutComponent,
    paths: {
      it: 'timeline',
      en: 'en/timeline'
    },
    data: { configId: 'timeline' }
  },
  timelineItem: {
    component: MrTimelineLayoutComponent,
    paths: {
      it: 'timeline/:id/:slug',
      en: 'en/timeline/:id/:slug'
    },
    data: {}
  },
  timelineRedirect: {
    paths: {
      it: 'timeline',
      en: 'en/timeline'
    },
    isRedirect: true,
  },
  map: {
    component: MrMapLayoutComponent,
    paths: {
      it: 'map/:id/:slug',
      en: 'en/map/:id/:slug'
    },
    data: { configId: 'map' }
  },
  mapLanding: {
    component: MrMapLayoutComponent,
    paths: {
      it: 'map/',
      en: 'en/map/'
    },
    data: { configId: 'map' }
  },
  mapRedirect: {
    paths: {
      it: 'map',
      en: 'en/map',
    },
    isRedirect: true,
  },
  post: {
    component: MrStaticLayoutComponent,
    paths: {
      it: 'post/:slug',
      en: 'en/posts/:slug',
    },
    data: { configId: 'post' }
  },
  itinerary: {
    component: MrItineraryLayoutComponent,
    paths: {
      it: 'itinerary/:id/:slug',
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

console.log('routes----------------------------->', APP_ROUTES);

export { APP_ROUTES };
