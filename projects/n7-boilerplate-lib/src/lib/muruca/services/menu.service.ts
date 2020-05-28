import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigurationService } from '../../common/services/configuration.service';

// FIXME: togliere
const fakeResponse = [
  {
    label: 'Home (base)',
    slug: 'home-base',
    isStatic: true
  },
  {
    label: 'Home (pro)',
    slug: 'home-pro',
    isStatic: true
  },
  {
    label: 'Chi siamo',
    slug: 'chi-siamo',
  },
  {
    label: 'Sample Page',
    slug: 'sample-page',
  },
  {
    label: 'Opere',
    slug: 'opere',
    isStatic: true
  },
  {
    label: 'Glossario',
    slug: 'glossario',
    isStatic: true
  },
  {
    label: 'Toponimia',
    slug: 'toponimia',
    isStatic: true
  }
];

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
      // FIXME: togliere
      catchError(() => of(fakeResponse)),
      // catchError(() => of(null)),
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
