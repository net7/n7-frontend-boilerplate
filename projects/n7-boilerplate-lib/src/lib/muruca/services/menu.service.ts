import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { Anchor } from '@n7-frontend/components';
import { ConfigurationService } from '../../common/services/configuration.service';

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
        label, slug, isStatic, subpages
      }) => {
        const href = `/${slug}`;
        // dynamic path control
        if (!isStatic) {
          this.dynamicPaths.push(href);
        }

        type menuItem = {
          text: string;
          anchor: Anchor;
          _meta: any;
          subnav?: menuItem[];
        }

        const item: menuItem = {
          text: label,
          anchor: { href },
          _meta: {
            id: href
          }
        };

        if (subpages !== undefined) {
          item['subnav'] = [];
          subpages.forEach((el) => {
            const subHref = `/${el.slug}`;
            if (!el.isStatic) {
              this.dynamicPaths.push(subHref);
            }
            item.subnav.push({
              text: el.label,
              anchor: { href: subHref },
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
