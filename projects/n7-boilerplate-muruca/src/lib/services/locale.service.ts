import { Injectable } from '@angular/core';
import { Router, RoutesRecognized } from '@angular/router';
import { ReplaySubject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

@Injectable()
export class MrLocaleService {
  private routeId: string;

  private locale: string;

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
      const href = routeConfig.path
        .replace(':id', id)
        .replace(':slug', slug);
      return `/${href}`;
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
}
