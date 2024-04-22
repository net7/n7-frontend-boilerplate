// Routes per Metadata Dynamic Accordion (sls Theatheor/Auteso con mock resource)

import { Routes } from '@angular/router';

import { Page404LayoutComponent } from '@net7/boilerplate-common';
import {
  // MrHomeLayoutComponent,
  MrSearchLayoutComponent,
  MrStaticLayoutComponent,
  MrResourceLayoutComponent,
  MrAdvancedSearchLayoutComponent,
  // MrAdvancedResultsLayoutComponent,
  // MrItineraryLayoutComponent,
  // MrPostsLayoutComponent,
  // MrTimelineLayoutComponent,
  // MrMapLayoutComponent,
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

  // RICERCA OPERE
  works: {
    component: MrSearchLayoutComponent,
    paths: {
      it: 'obras',
      en: 'en/obras'
    },
    data: { configId: 'search-works' },
  },

  // OPERA E TABS
  work: {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'obra/:id/:slug',
      en: 'en/obra/:id/:slug'
    },
    data: { configId: 'resource-work' }
  },
  'datos-bibliograpicos': {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'obra/:id/:slug/datos-bibliograficos',
      en: 'en/obra/:id/:slug/datos-bibliograficos'
    },
    data: { configId: 'resource-work-datos-bibliograficos' }
  },
  'datos-codicologicos': {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'obra/:id/:slug/datos-codicologicos',
      en: 'en/obra/:id/:slug/datos-codicologicos'
    },
    data: { configId: 'resource-work-datos-codicologicos' }
  },
  'proceso-composicion': {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'obra/:id/:slug/proceso-composicion',
      en: 'en/obra/:id/:slug/proceso-composicion'
    },
    data: { configId: 'resource-work-proceso-composicion' }
  },
  'bibliografia-citada': {
    component: MrResourceLayoutComponent,
    paths: {
      it: 'obra/:id/:slug/bibliografia-citada',
      en: 'en/obra/:id/:slug/bibliografia-citada'
    },
    data: { configId: 'resource-work-bibliografia-citada' }
  },

  // RICERCA AVANZATA
  advancedSearch: {
    component: MrAdvancedSearchLayoutComponent,
    paths: {
      it: 'busqueda-avanzada',
      en: 'en/busqueda-avanzada'
    },
    data: { configId: 'advanced-search-auteso' }
  },
};

const APP_ROUTES: Routes = [
  {
    path: 'obra/:id/:slug',
    redirectTo: 'obra/:id/:slug/datos-bibliograficos',
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
