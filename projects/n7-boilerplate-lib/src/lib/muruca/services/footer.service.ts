import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigurationService } from '../../common/services/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class MrFooterService {
  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
  ) {}

  load(): Promise<any> {
    const { defaultProvider, providers } = this.configuration.get('communication');
    const currentProvider = providers[defaultProvider] || {};
    const { baseUrl } = currentProvider;
    const menuPath = currentProvider?.config?.footer;

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
      this.configuration.set('footer', response);
    }
  }
}
