import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationProvider } from './communication-provider.interface';
import { CommunicationOptions } from '../communication.service';

@Injectable({
  providedIn: 'root',
})
export class RestProvider implements CommunicationProvider {
  constructor(
    private http: HttpClient,
  ) {}

  request$(providerConfig, requestId, options: CommunicationOptions) {
    const {
      params, httpOptions, urlParams = '',
    } = options;
    let { method } = options;
    let point;

    // default method
    if (!method) { method = providerConfig.defaultMethod || 'GET'; }

    if (providerConfig.config && providerConfig.config[requestId]) {
      point = providerConfig.config[requestId];
    }

    // config point control
    if (!point) {
      throw Error(`No config found for requestId "${requestId}"`);
    }

    const formattedUrl = this.getFormattedUrl(providerConfig.baseUrl, point, urlParams);
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      return this.http[method.toLowerCase()](
        formattedUrl,
        params,
        httpOptions
      );
    } if (['GET', 'DELETE'].includes(method)) {
      return this.http[method.toLowerCase()](
        formattedUrl,
        httpOptions
      );
    }
    throw Error(`Rest method ${method} not supported`);
  }

  private getFormattedUrl(baseUrl: string, point: string, urlParams: string | object) {
    if (typeof urlParams === 'string') {
      return baseUrl + point + urlParams;
    }
    return baseUrl + this.parseUrlPlaceholders(point, urlParams);
  }

  private parseUrlPlaceholders(source: string, placeholders: object) {
    return source.replace(/{\s*\w+\s*}/g, (match) => {
      const key = match.replace(/{|}/g, '').trim();
      return placeholders[key] || match;
    });
  }
}
