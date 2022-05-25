import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
} from '@angular/router';
import { Observable } from 'rxjs';
import { MrTranslationsLoaderService } from '../services/translations-loader.service';
import { MrFooterService } from '../services/footer.service';
import { MrMenuService } from '../services/menu.service';

@Injectable({
  providedIn: 'root',
})
export class LocaleDependenciesGuard implements CanActivate {
  private prevRouteId: string;

  private prevLocale: string;

  constructor(
    private menuService: MrMenuService,
    private footerService: MrFooterService,
    private translationsLoader: MrTranslationsLoaderService,
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const { locale, routeId } = route.data;
    // check routeId to force reload
    if (
      (routeId && this.prevRouteId === routeId)
      && (locale && this.prevLocale !== locale)
    ) {
      const { url } = state;
      document.location.href = url;
      return Promise.reject();
    }
    this.prevRouteId = routeId;
    this.prevLocale = locale;
    return Promise.all([
      this.menuService.load(locale),
      this.footerService.load(locale),
      this.translationsLoader.load(locale)
    ])
      .then(() => Promise.resolve(true))
      .catch((err) => {
        console.warn('Locale dependencies error:', err);
        return Promise.resolve(true);
      });
  }
}
