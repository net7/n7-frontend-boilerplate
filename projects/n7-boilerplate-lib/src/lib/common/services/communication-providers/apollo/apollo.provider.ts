import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import ApolloConfig from './apollo.config';
import { ConfigurationService } from '../../configuration.service';
import { ICommunicationProvider } from '../communication-provider.interface';


@Injectable({
  providedIn: 'root'
})
export class ApolloProvider implements ICommunicationProvider {
  private providerConfig: any;

  constructor(
    private config: ConfigurationService,
    private http: HttpClient,
  ) {
    try {
      this.providerConfig = this.config.get('communication').providers.apollo;
    } catch(err) {
      throw Error('No config found for apollo provider!');
    }
  }

  request$(requestId, options){
    const { params, method, httpOptions } = options;
    let query = ApolloConfig[requestId];

    if(this.providerConfig.config && this.providerConfig.config[requestId]){
      query = this.providerConfig.config[requestId];
    }

    // config query control
    if(!query) throw Error(`No config found for requestId "${requestId}"`);

    if(params){
      let paramsStr = this.makeParamsStr(params);
      query = query.replace('__PARAMS__', paramsStr);
    } else {
      query = query.replace('(__PARAMS__)', '');
    }

    if(method && method === 'GET'){
      return this.http.get(this.providerConfig.baseUrl);
    } else {
      return this.http.post(this.providerConfig.baseUrl, { query }, httpOptions);
    }
  }

  getConfig = () => this.providerConfig;

  private makeParamsStr(params){
    let paramsStr = [];
    Object.keys(params).forEach(key => {
      if(Array.isArray(params[key])){
        let arrStr = [];
        params[key].forEach( val => {
          if(typeof(val)==='object'){
            let subParamsStr = this.makeParamsStr(val);
            arrStr.push(`{ ${subParamsStr} }`);
          } else {
            if(!isNaN(val)) arrStr.push(`${val}`);
            else arrStr.push(`"${val}"`)
          }
        });
        paramsStr.push(`${key}: [${arrStr.join(',')}]`);
      } else if( typeof(params[key])==='object' && params[key] ){
          let subParamsStr = this.makeParamsStr(params[key]);
          paramsStr.push(`${key}: { ${subParamsStr} }`);
      } else if( typeof(params[key])==='string' && key.indexOf('$') === 0){
        paramsStr.push(`${key.replace('$', '')}: ${params[key]}`);
      } else {
        if(!isNaN(params[key])) paramsStr.push(`${key}: ${params[key]}`);
        else paramsStr.push(`${key}: "${params[key]}"`);
      }
    });
    return paramsStr.join(' ');
  }

}
