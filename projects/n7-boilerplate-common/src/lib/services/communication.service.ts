import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { HttpContext, HttpHeaders, HttpResponse } from '@angular/common/http';
import { ConfigurationService } from './configuration.service';
import { ApolloProvider } from './communication-providers/apollo.provider';
import { RestProvider } from './communication-providers/rest.provider';

export type CommunicationHttpOptions = {
  body?: any;
  context?: HttpContext;
  responseType?: 'arraybuffer' | 'blob' | 'json' | 'text';
  withCredentials?: boolean;
  headers?: HttpHeaders | {
      [header: string]: string | string[];
  };
}

export type CommunicationOptions<T> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  params?: T;
  urlParams?: string | object;
  httpOptions?: CommunicationHttpOptions;
  onError?: (err) => void;
}

@Injectable({
  providedIn: 'root',
})
export class CommunicationService {
  private defaultProvider: string;

  private communicationConfig: any;

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

  request$<T = object, U = object>(
    requestId: string,
    options?: CommunicationOptions<T>,
    provider?: string
  ): Observable<HttpResponse<U>> {
    const activeProvider = provider || this.defaultProvider;
    const activeProviderConfig = this.communicationConfig.providers[activeProvider];

    if (!activeProviderConfig) {
      throw Error(`There is no config for "${activeProvider}" provider`);
    }

    // provider.type control for retrocompatibility
    const activeProviderType = activeProviderConfig.type || activeProvider;

    if (!this[activeProviderType]) {
      throw Error(`There is no "${activeProviderType}" provider type`);
    }

    const { onError } = options || {};
    return this[activeProviderType].request$(activeProviderConfig, requestId, options || {})
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

  getUrl(requestId, provider?) {
    const activeProvider = provider || this.defaultProvider;
    const activeProviderConfig = this.communicationConfig.providers[activeProvider];

    if (!activeProviderConfig) {
      throw Error(`There is no config for "${activeProvider}" provider`);
    }

    const { baseUrl } = activeProviderConfig;

    if (!activeProviderConfig.config[requestId]) {
      throw Error(`There is no config for "${requestId}" `);
    }
    return baseUrl + activeProviderConfig.config[requestId];
  }
}
