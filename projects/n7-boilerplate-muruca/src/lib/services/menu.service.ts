import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Anchor } from '@net7/components';
import { ConfigurationService } from '@net7/boilerplate-common';
import linksHelper from '../helpers/links-helper';
import { MrLocaleService } from './locale.service';

type MenuItem = {
  text: string;
  anchor: Anchor;
  _meta: any;
  subnav?: MenuItem[];
  classes?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MrMenuService {
  private dynamicPaths: string[] = [];

  private cache: {
    [locale: string]: object;
  } = {};

  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
    private localeService: MrLocaleService,
  ) {}

  load(locale = null): Promise<any> {
    if (locale && this.cache[locale]) {
      this._handleResponse(this.cache[locale]);
      return Promise.resolve();
    }

    const { defaultProvider, providers } = this.configuration.get('communication');
    const currentProvider = providers[defaultProvider] || {};
    const { baseUrl } = currentProvider;
    const menuPath = currentProvider?.config?.menu;

    if (baseUrl && menuPath) {
      let url = baseUrl + menuPath;
      if (locale) {
        url += `?locale=${locale}`;
      }
      return this.http.get(url).pipe(
        catchError(() => of(null)),
        tap((response) => {
          this.cache[locale] = response;
          this._handleResponse(response, locale);
        }),
      ).toPromise();
    }
    return of(null).toPromise();
  }

  private _handleResponse(response, locale?: string) {
    if (response) {
      const headerConfig = this.configuration.get('header');
      headerConfig.nav.items = response.map(({
        label, slug, isStatic, subpages, classes
      }) => {
        const href = this.getHref(slug);
        // dynamic path control
        if (!isStatic) {
          this.dynamicPaths.push(href);
        }

        const item = {
          classes,
          text: label,
          anchor: href ? {
            href: linksHelper.getRouterLink(href),
            queryParams: linksHelper.getQueryParams(href)
          } : null,
          _meta: {
            id: href
          }
        } as MenuItem;

        if (subpages !== undefined) {
          item.subnav = [];
          subpages.forEach((el) => {
            const subHref = this.getHref(el.slug);
            if (!el.isStatic) {
              this.dynamicPaths.push(subHref);
            }
            item.subnav.push({
              classes: el.classes || null,
              text: el.label,
              anchor: subHref ? {
                href: linksHelper.getRouterLink(subHref),
                queryParams: linksHelper.getQueryParams(subHref)
              } : null,
              _meta: {
                id: subHref
              }
            });
          });
        }
        return item;
      });
      if (locale) {
        const href = this.localeService.getLink(locale, 'home');
        if (href) {
          headerConfig.logo.anchor = { href };
        }
      }
      this.configuration.set('header', headerConfig);
    }
  }

  public isDynamicPath = (path: string) => this.dynamicPaths.includes(path);

  private getHref(link: string) {
    let href = link || null;
    if (href && !linksHelper.isExternalLink(href)) {
      href = `/${href}`;
    }
    return href;
  }
}
