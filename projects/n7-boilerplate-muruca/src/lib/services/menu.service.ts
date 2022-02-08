import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Anchor } from '@n7-frontend/components';
import { ConfigurationService } from '@net7/boilerplate-common';
import linksHelper from '../helpers/links-helper';

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

  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
  ) {}

  load(): Promise<any> {
    const { defaultProvider, providers } = this.configuration.get('communication');
    const currentProvider = providers[defaultProvider] || {};
    const { baseUrl } = currentProvider;
    const menuPath = currentProvider?.config?.menu;

    if (baseUrl && menuPath) {
      const url = baseUrl + menuPath;
      return this.http.get(url).pipe(
        catchError(() => of(null)),
        tap((response) => this._handleResponse(response)),
      ).toPromise();
    }
    return of(null).toPromise();
  }

  private _handleResponse(response) {
    if (response) {
      const headerConfig = this.configuration.get('header');
      headerConfig.nav.items = response.map(({
        label, slug, isStatic, subpages, classes
      }) => {
        const href = slug ? `/${slug}` : null;
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
            const subHref = el.slug ? `/${el.slug}` : null;
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
      this.configuration.set('header', headerConfig);
    }
  }

  public isDynamicPath = (path: string) => this.dynamicPaths.includes(path);
}
