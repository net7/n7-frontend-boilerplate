import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import {
  HttpContext, HttpHeaders, HttpParams
} from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { ApolloProvider } from './communication-providers/apollo.provider';
import { RestProvider } from './communication-providers/rest.provider';
import { ConfigCommonCommunication } from '../config-types';

export type CommunicationQueryParams = HttpParams | {
  [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
};

export type CommunicationHttpOptions = {
  body?: any;
  context?: HttpContext;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  params?: CommunicationQueryParams;
  headers?: HttpHeaders | {
    [header: string]: string | string[];
  };
}

export type CommunicationOptions<U> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: U;
  urlParams?: string | object;
  queryParams?: CommunicationQueryParams;
  httpOptions?: CommunicationHttpOptions;
  onError?: (err) => void;
}

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private defaultProvider: string;

  private communicationConfig: ConfigCommonCommunication;

  constructor(
    private config: ConfigurationService,
    private apollo: ApolloProvider,
    private rest: RestProvider,
  ) {
    try {
      this.communicationConfig = this.config.get('communication');
      this.defaultProvider = this.communicationConfig.defaultProvider;
    } catch (err) {
      throw Error('No communications.defaultProvider setted in config');
    }
  }

  request$<T = any, U = any>(
    requestId: string,
    options?: CommunicationOptions<U>,
    provider?: string
  ): Observable<T> {
    const activeProvider = provider || this.defaultProvider;
    const activeProviderConfig = this.communicationConfig.providers[activeProvider];

    if (!activeProviderConfig) {
      throw Error(`There is no config for "${activeProvider}" provider`);
    }

    // provider.type check for retrocompatibility
    const activeProviderType = activeProviderConfig.type || activeProvider;

    if (!this[activeProviderType]) {
      throw Error(`There is no "${activeProviderType}" provider type`);
    }

    const requestOptions = options || {};

    // adding query params
    // to http client httpoptions params
    if (requestOptions.queryParams) {
      requestOptions.httpOptions = {
        ...(requestOptions.httpOptions || {}),
        params: requestOptions.queryParams
      };
    }

    const { onError } = options || {};
    return this[activeProviderType].request$<T>(activeProviderConfig, requestId, requestOptions)
      .pipe(
        catchError((error) => this.handleError(error, onError)),
      );
  }

  handleError(error, onError): Observable<any> {
    if (onError) {
      onError(error);
    } else {
      console.warn('No error handler for communication request', error);
    }

    return EMPTY;
  }

  getUrl(requestId?, provider?) {
    const activeProvider = provider || this.defaultProvider;
    const activeProviderConfig = this.communicationConfig.providers[activeProvider];

    if (!activeProviderConfig) {
      throw Error(`There is no config for "${activeProvider}" provider`);
    }

    const { baseUrl } = activeProviderConfig;

    if (!requestId) {
      return baseUrl;
    }

    if (!activeProviderConfig.config[requestId]) {
      throw Error(`There is no config for "${requestId}"`);
    }
    return baseUrl + activeProviderConfig.config[requestId];
  }
}
