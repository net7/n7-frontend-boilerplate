import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
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
      headerConfig.nav.items = response.map(({ label, slug, isStatic }) => {
        const href = `/${slug}`;
        // dynamic path control
        if (!isStatic) {
          this.dynamicPaths.push(href);
        }
        return {
          text: label,
          anchor: { href },
          _meta: {
            id: href
          }
        };
      });
      this.configuration.set('header', headerConfig);
    }
  }

  public isDynamicPath = (path: string) => this.dynamicPaths.includes(path);
}
