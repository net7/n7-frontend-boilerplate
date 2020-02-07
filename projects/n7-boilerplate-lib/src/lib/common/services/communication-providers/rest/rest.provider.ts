import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { RestProviderConfig } from './config';
import { ConfigurationService } from '../../configuration.service';
import { ICommunicationProvider } from '../communication-provider.interface';


@Injectable({
  providedIn: 'root'
})
export class RestProvider implements ICommunicationProvider {
  constructor(
    private config: ConfigurationService,
    private http: HttpClient
  ) {}

  request$(providerId, requestId, options: any = {}) {
    const { params, httpOptions, urlParams = '' } = options,
      provider = this.config.get('communication').providers[providerId],
      method = options.method || provider.defaultMethod || 'GET';

    let point = RestProviderConfig[providerId] ? RestProviderConfig[providerId][requestId] : null;

    if (provider.config && provider.config[requestId]) {
      point = provider.config[requestId];
    }

    // config point control
    if (!point) {
        throw Error(`No config found for requestId "${requestId}"`);
    }
    if (method === 'POST' || method === 'PUT') {
      return this.http[method.toLowerCase()](provider.baseUrl + point, params, httpOptions);
    } else if (method === 'GET' || method === 'DELETE') {
      return this.http[method.toLowerCase()](provider.baseUrl + point + urlParams, httpOptions);
    } else {
        throw Error(`Rest method ${method} not supported`);
    }

  }
}
