import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

export type LocaleResourceConfig = {
  [locale: string]: {
    id: string;
    slug: string;
  };
};

@Injectable()
export class MrLocaleService {
  private routeId: string;

  private locale: string;

  private resourceConfig: LocaleResourceConfig = null;

  public changed$: ReplaySubject<{ routeId: string; locale: string; }> = new ReplaySubject();

  constructor(
    private router: Router
  ) {
    this.router.events.pipe(
      filter((event) => event instanceof RoutesRecognized),
      map((event: RoutesRecognized) => event.state.root.firstChild.data)
    ).subscribe(({ routeId, locale }) => {
      this.routeId = routeId;
      this.locale = locale;

      this.changed$.next({
        routeId: this.routeId,
        locale: this.locale
      });

      // remove previous config
      this.resourceConfig = null;
    });
  }

  getRouteId = () => this.routeId;

  getLocale = () => this.locale;

  getLink = (locale: string, routeId: string, id?: string, slug?: string) => {
    const routeConfig = this.router.config.find((config) => {
      const { routeId: currentRouteId, locale: currentRouteLocale } = config?.data || {};
      return routeId === currentRouteId && locale === currentRouteLocale;
    });
    if (routeConfig?.path) {
      const resourceLocaleConfig = this.resourceConfig && this.resourceConfig[locale]
        ? this.resourceConfig[locale]
        : { id: null, slug: null };
      let idParam = '';
      let slugParam = '';
      if (id) {
        idParam = `/${id}`;
      } else if (resourceLocaleConfig.id) {
        idParam = `/${resourceLocaleConfig.id}`;
      }
      if (slug) {
        slugParam = `/${slug}`;
      } else if (resourceLocaleConfig.slug) {
        slugParam = `/${resourceLocaleConfig.slug}`;
      }
      const href = routeConfig.path
        .replace('/:id', idParam)
        .replace('/:slug', slugParam);
      return href.indexOf('/') === 0 ? `${href}` : `/${href}`;
    }
    console.warn('LocaleService link not found', locale, routeId);
    return '';
  };

  getLinkByLocale = (
    locale: string,
    id?: string,
    slug?: string
  ) => this.getLink(locale, this.routeId, id, slug);

  getLinkByRouteId = (
    routeId: string,
    id?: string,
    slug?: string
  ) => this.getLink(this.locale, routeId, id, slug);

  setResourceConfig = (config: LocaleResourceConfig) => {
    this.resourceConfig = config;
  };
}
