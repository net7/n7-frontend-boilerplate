import { Injectable } from '@angular/core';
import { ConfigurationService } from './configuration.service';
import { ApolloProvider } from './communication-providers/apollo/apollo.provider';
import { RestProvider } from './communication-providers/rest/rest.provider';
import { catchError } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  private defaultProvider: string;
  private communicationConfig: any;

  constructor(
    private config: ConfigurationService,
    private apollo: ApolloProvider,
    private rest: RestProvider,
  ){
    try {
      this.communicationConfig = this.config.get('communication');
      this.defaultProvider = this.communicationConfig.defaultProvider;
    } catch (err) {
      throw Error('No communications.defaultProvider setted in config');
    }
  }

  request$(requestId, options: any = {}, providerId?) {
    providerId = providerId || this.defaultProvider;
    const { providers } = this.communicationConfig,
      config = providers[providerId] || null;

    if (!config) {
      throw Error(`There is no ${providerId} provider`);
    }

    if (!this[config.type]) {
      throw Error(`There is no ${config.type} provider type`);
    }

    const { onError } = options;
    return this[config.type].request$(providerId, requestId, options)
      .pipe(
        catchError((error) => this.handleError(error, onError))
      );
  }

  handleError(error, onError): Observable<any> {
    if (onError) {
      onError(error);
    } else {
      console.warn('No error handler for communication request', error);
    }

    return empty();
  }
}