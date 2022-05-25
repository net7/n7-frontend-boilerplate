import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigurationService } from '@net7/boilerplate-common';

@Injectable({
  providedIn: 'root',
})
export class MrFooterService {
  private cache: {
    [locale: string]: boolean;
  } = {};

  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
  ) {}

  load(locale = null): Promise<any> {
    if (locale && this.cache[locale]) {
      this._handleResponse(this.cache[locale]);
      return Promise.resolve();
    }

    const { defaultProvider, providers } = this.configuration.get('communication');
    const currentProvider = providers[defaultProvider] || {};
    const { baseUrl } = currentProvider;
    const menuPath = currentProvider?.config?.footer;

    if (baseUrl && menuPath) {
      let url = baseUrl + menuPath;
      if (locale) {
        url += `?locale=${locale}`;
      }
      return this.http.get(url).pipe(
        catchError(() => of(null)),
        tap((response) => {
          this.cache[locale] = response;
          this._handleResponse(response);
        }),
      ).toPromise();
    }
    return of(null).toPromise();
  }

  private _handleResponse(response) {
    if (response) {
      this.configuration.set('footer', response);
    }
  }
}
