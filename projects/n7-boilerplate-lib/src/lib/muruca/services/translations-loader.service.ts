import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { translate } from '@n7-frontend/core';
import { ConfigurationService } from '../../common/services/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class MrTranslationsLoaderService {
  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
  ) {}

  load(langCode: string): Promise<any> {
    const { defaultProvider, providers } = this.configuration.get('communication');
    const currentProvider = providers[defaultProvider] || {};
    const { baseUrl } = currentProvider;
    const menuPath = currentProvider?.config?.translations;

    if (baseUrl && menuPath) {
      const url = baseUrl + menuPath + langCode;
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
