import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigurationService } from '../../common/services/configuration.service';

@Injectable({
  providedIn: 'root',
})
export class MrMenuService {
  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
  ) {}

  load(path, rootPath): Promise<any> {
    return this.http.get(path).pipe(
      catchError(() => of(null)),
      tap((response) => this._handleResponse(response, rootPath)),
    ).toPromise();
  }

  private _handleResponse(response, rootPath) {
    if (response) {
      const headerConfig = this.configuration.get('header');
      headerConfig.nav.items = response.map(({ label, slug, isStatic }) => ({
        text: label,
        anchor: {
          href: isStatic ? slug : `${rootPath}/${slug}`
        },
        _meta: {
          id: slug
        }
      }));
      this.configuration.set('header', headerConfig);
    }
  }
}
