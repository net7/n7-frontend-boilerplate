import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommunicationProvider } from './communication-provider.interface';

@Injectable({
  providedIn: 'root',
})
export class RestProvider implements CommunicationProvider {
  constructor(
    private http: HttpClient,
  ) {}

  request$(providerConfig, requestId, options: any = {}) {
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
    if (method === 'POST' || method === 'PUT') {
      return this.http[method.toLowerCase()](
        providerConfig.baseUrl + point + urlParams, params, httpOptions,
      );
    } if (method === 'GET' || method === 'DELETE') {
      return this.http[method.toLowerCase()](
        providerConfig.baseUrl + point + urlParams, httpOptions,
      );
    }
    throw Error(`Rest method ${method} not supported`);
  }
}
