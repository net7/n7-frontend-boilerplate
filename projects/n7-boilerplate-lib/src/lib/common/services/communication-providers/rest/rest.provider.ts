import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RestProviderConfig } from './config';
import { ConfigurationService } from '../../configuration.service';
import { CommunicationProvider } from '../communication-provider.interface';


@Injectable({
  providedIn: 'root',
})
export class RestProvider implements CommunicationProvider {
  private providerConfig: any;

  constructor(
    private config: ConfigurationService,
    private http: HttpClient,
  ) {
    try {
      this.providerConfig = this.config.get('communication').providers.rest;
    } catch (err) {
      throw Error('No config found for rest provider!');
    }
  }

  request$(requestId, options: any = {}) {
    const {
      params, httpOptions, urlParams = '',
    } = options;
    let { method } = options;
    let point = RestProviderConfig[requestId];

    // default method
    if (!method) { method = this.providerConfig.defaultMethod || 'GET'; }

    if (this.providerConfig.config && this.providerConfig.config[requestId]) {
      point = this.providerConfig.config[requestId];
    }

    // config point control
    if (!point) {
      throw Error(`No config found for requestId "${requestId}"`);
    }
    if (method === 'POST' || method === 'PUT') {
      return this.http[method.toLowerCase()](
        this.providerConfig.baseUrl + point, params, httpOptions,
      );
    } if (method === 'GET' || method === 'DELETE') {
      return this.http[method.toLowerCase()](
        this.providerConfig.baseUrl + point + urlParams, httpOptions,
      );
    }
    throw Error(`Rest method ${method} not supported`);
  }
}
