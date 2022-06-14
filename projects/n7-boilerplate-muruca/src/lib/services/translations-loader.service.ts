import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { translate } from '@net7/core';
import { ConfigurationService } from '@net7/boilerplate-common';

@Injectable({
  providedIn: 'root',
})
export class MrTranslationsLoaderService {
  private loaded: {
    [locale: string]: boolean;
  } = {};

  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
  ) {}

  load(langCode: string): Promise<any> {
    // update translate module
    translate.setCurrentLang(langCode);

    // locale already loaded check
    if (this.loaded[langCode]) {
      this.loaded[langCode] = true;
      return Promise.resolve();
    }
    const { defaultProvider, providers } = this.configuration.get('communication');
    const currentProvider = providers[defaultProvider] || {};
    const { baseUrl } = currentProvider;
    const translationsPath = currentProvider?.config?.translation;

    if (baseUrl && translationsPath) {
      const url = baseUrl + translationsPath + langCode;
      return this.http.get(url).pipe(
        catchError(() => of(null)),
        tap((response) => this._handleResponse(response, langCode)),
      ).toPromise();
    }
    return of(null).toPromise();
  }

  private _handleResponse(response: object, langCode: string) {
    if (response) {
      Object.keys(response).forEach((key) => {
        translate.setLangTranslation(langCode, key, response[key]);
      });
    }
  }
}
