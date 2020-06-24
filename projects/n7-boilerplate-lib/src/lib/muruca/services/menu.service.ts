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

  load(path): Promise<any> {
    return this.http.get(path).pipe(
      catchError(() => of(null)),
      tap((response) => this._handleResponse(response)),
    ).toPromise();
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
