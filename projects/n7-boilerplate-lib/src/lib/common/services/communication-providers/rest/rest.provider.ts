import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import RestConfig from './rest.config';
import { ConfigurationService } from '../../configuration.service';
import { ICommunicationProvider } from '../communication-provider.interface';


@Injectable({
  providedIn: 'root'
})
export class RestProvider implements ICommunicationProvider {
  private providerConfig: any;

  constructor(
    private config: ConfigurationService,
    private http: HttpClient,
  ) {
    try {
      this.providerConfig = this.config.get('communication').providers.rest;
    } catch(err) {
      throw Error('No config found for rest provider!');
    }
  }

  request$(requestId, options){
    const { params, method, httpOptions } = options;
    let point = RestConfig[requestId];

    if(this.providerConfig.config && this.providerConfig.config[requestId]){
      point = this.providerConfig.config[requestId];
    }

    // config point control
    if(!point) throw Error(`No config found for requestId "${requestId}"`);

    if(method && method === 'POST'){
      return this.http.post(this.providerConfig.baseUrl + point, params, httpOptions);
    } else {
      return this.http.get(this.providerConfig.baseUrl + point);
    }
  }

  getConfig = () => this.providerConfig;

}
