import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { CommunicationProvider } from './communication-provider.interface';
import { ConfigurationService } from '../configuration.service';
import { CommunicationOptions } from '../communication.service';

const DEFAULT_TREE_DEPTH = 15;

@Injectable({
  providedIn: 'root',
})
export class ApolloProvider implements CommunicationProvider {
  constructor(
    private http: HttpClient,
    private configuration: ConfigurationService,
  ) {}

  request$<T>(providerConfig, requestId: string, options: CommunicationOptions<T>) {
    const { params, method, httpOptions } = options;
    const treeDepth = this.configuration.get('treeDepth') || DEFAULT_TREE_DEPTH;
    const config = providerConfig.config ? providerConfig.config(treeDepth) : {};
    let query;

    if (config && config[requestId]) {
      query = config[requestId];
    }

    query = query || {};
    const { queryName } = query;
    let { queryBody } = query;

    // config query control
    if (!queryName || !queryBody) {
      throw Error(`No config found for requestId '${requestId}'`);
    }

    if (params) {
      const paramsStr = this.makeParamsStr(params);
      queryBody = queryBody.replace('__PARAMS__', paramsStr);
    } else {
      queryBody = queryBody.replace('(__PARAMS__)', '');
    }

    let source$: Observable<any>;

    if (method && method === 'GET') {
      source$ = this.http.get(providerConfig.baseUrl);
    } else {
      source$ = this.http.post(
        providerConfig.baseUrl,
        { query: queryBody },
        {
          ...httpOptions,
          responseType: 'json' // force to json
        },
      );
    }

    return source$.pipe(map((response: any) => response.data[queryName]));
  }

  private makeParamsStr(params) {
    const paramsStr = [];
    Object.keys(params).forEach((key) => {
      if (Array.isArray(params[key])) {
        const arrStr = [];
        params[key].forEach((val) => {
          if (typeof val === 'object') {
            const subParamsStr = this.makeParamsStr(val);
            arrStr.push(`{ ${subParamsStr} }`);
          } else if (typeof val === 'number' || typeof val === 'boolean' || val === null) {
            arrStr.push(`${val}`);
          } else {
            // JSON.stringify yields a valid GraphQL string literal (same escape
            // sequences), so user input containing " or \ doesn't break the query.
            arrStr.push(JSON.stringify(val));
          }
        });
        paramsStr.push(`${key}: [${arrStr.join(',')}]`);
      } else if (typeof params[key] === 'object' && params[key]) {
        const subParamsStr = this.makeParamsStr(params[key]);
        paramsStr.push(`${key}: { ${subParamsStr} }`);
      } else if (typeof params[key] === 'string' && key.indexOf('$') === 0) {
        paramsStr.push(`${key.replace('$', '')}: ${params[key]}`);
      } else if (typeof params[key] === 'number' || typeof params[key] === 'boolean' || params[key] === null) {
        paramsStr.push(`${key}: ${params[key]}`);
      } else {
        // JSON.stringify yields a valid GraphQL string literal (same escape
        // sequences), so user input containing " or \ doesn't break the query.
        paramsStr.push(`${key}: ${JSON.stringify(params[key])}`);
      }
    });
    return paramsStr.join(' ');
  }
}
