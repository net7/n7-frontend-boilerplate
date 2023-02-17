import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { isObject, merge } from 'lodash';
import { ConfigurationService } from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class JsonConfigService {
  constructor(
    private http: HttpClient,
    private config: ConfigurationService,
  ) {}

  load(path): Promise<any> {
    return this.http.get(path).pipe(
      catchError(() => of({})),
      tap((response) => this._handleResponse(response)),
    ).toPromise();
  }

  private _handleResponse(response) {
    // set loaded json config
    if (response) {
      // merge config
      Object.keys(response).forEach((key) => {
        const oldValue = this.config.get(key);
        const newValue = response[key];
        const mergeValue = this.mergeConfigKey(oldValue, newValue);
        this.config.set(key, mergeValue);
      });

      // config keys colors
      if (response['config-keys']) {
        const headTag = document.querySelector('head');
        const styleElement = document.createElement('style');

        const styles = [];

        Object.keys(response['config-keys']).forEach((key) => {
          const configKey = response['config-keys'][key] || {};
          const className = configKey['class-name'];

          if (configKey.color && configKey.color.hex) {
            // add css class
            styles.push(`--color-${className}: ${configKey.color.hex};`);
          }
        });

        if (styles.length) {
          styles.unshift(':root {');
          styles.push('}');
          styleElement.appendChild(document.createTextNode(styles.join('\n')));
          headTag.appendChild(styleElement);
        }
      }
    }
  }

  public mergeConfigKey(oldValue, newValue) {
    if (isObject(oldValue) && isObject(newValue)) {
      return merge(oldValue, newValue);
    }
    return newValue || oldValue;
  }
}
