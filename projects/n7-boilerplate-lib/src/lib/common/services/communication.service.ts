import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { ApolloProvider } from './communication-providers/apollo.provider';
import { RestProvider } from './communication-providers/rest.provider';

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

  request$(requestId, options: any = {}, provider?) {
    const activeProvider = provider || this.defaultProvider;
    const activeProviderConfig = this.communicationConfig.providers[activeProvider];
    // provider.type control for retrocompatibility
    const activeProviderType = activeProviderConfig.type || activeProvider;

    if (!activeProviderConfig) {
      throw Error(`There is no config for ${activeProvider} provider`);
    }

    if (!this[activeProviderType]) {
      throw Error(`There is no ${activeProviderType} provider`);
    }

    const { onError } = options;
    return this[activeProviderType].request$(activeProviderConfig, requestId, options)
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

    return empty();
  }
}
