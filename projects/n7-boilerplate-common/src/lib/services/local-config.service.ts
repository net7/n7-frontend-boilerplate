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

          // config keys colors
          if (config['config-keys']) {
            const headTag = document.querySelector('head');
            const styleElement = document.createElement('style');

            const styles = [];

            Object.keys(config['config-keys']).forEach((key) => {
              const configKey = config['config-keys'][key] || {};
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
      }),
    ).toPromise();
  }
}
