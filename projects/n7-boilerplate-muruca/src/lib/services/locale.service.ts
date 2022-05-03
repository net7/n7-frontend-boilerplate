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

  getRouteByLocale = (locale: string) => this.router.config.find((routeConfig) => {
    const { routeId, locale: routeLocale } = routeConfig?.data || {};
    return routeId === this.routeId && locale === routeLocale;
  });
}
