import { Injectable } from '@angular/core';
import { tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class LocalConfigService {
  constructor(
    private config: ConfigurationService,
  ) {}

  load(config): Promise<any> {
    return of(true).pipe(
      tap(() => {
        if (config) {
          Object.keys(config).forEach((key) => this.config.set(key, config[key]));
        }
      }),
    ).toPromise();
  }
}
