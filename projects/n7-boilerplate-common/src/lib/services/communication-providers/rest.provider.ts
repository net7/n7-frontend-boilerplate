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

  request$<T>(providerConfig, requestId, options: CommunicationOptions<T>) {
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
    if (['POST', 'PUT', 'PATCH'].includes(method)) {
      return this.http[method.toLowerCase()](
        providerConfig.baseUrl + point + urlParams,
        params,
        httpOptions
      );
    } if (['GET', 'DELETE'].includes(method)) {
      return this.http[method.toLowerCase()](
        providerConfig.baseUrl + point + urlParams,
        httpOptions
      );
    }
    throw Error(`Rest method ${method} not supported`);
  }
}
