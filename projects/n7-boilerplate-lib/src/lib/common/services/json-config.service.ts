import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { ConfigurationService } from './configuration.service';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonConfigService {
  constructor(
    private http: HttpClient,
    private config: ConfigurationService,
  ){}

  load(path): Promise<any> {
    return this.http.get(path).pipe(
      catchError((error) => of({})),
      tap(response => this._handleResponse(response))
    ).toPromise();
  }

  private _handleResponse(response){
    if(response){
      Object.keys(response).forEach(key => this.config.set(key, response[key]));

      // config keys colors
      if(response['config-keys']){
        const headTag = document.querySelector('head'),
          styleElement = document.createElement('style');

        let styles = [];

        Object.keys(response['config-keys']).forEach(key => {
          const configKey = response['config-keys'][key] || {};
          
          if(configKey.color && configKey.color.hex){
            // add css class
            styles.push(`--color-${key}: ${configKey.color.hex};`);
          }
        });

        if(styles.length){
          styles.unshift(':root {');
          styles.push('}');
          styleElement.appendChild(document.createTextNode(styles.join('\n')));
          headTag.appendChild(styleElement);
        }

      }
    }
  }
}