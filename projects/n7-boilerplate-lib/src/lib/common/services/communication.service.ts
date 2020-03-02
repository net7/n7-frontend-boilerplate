import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Observable, empty } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { ApolloProvider } from './communication-providers/apollo/apollo.provider';
import { RestProvider } from './communication-providers/rest/rest.provider';

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
    if (!this[activeProvider]) throw Error(`There is no ${activeProvider} provider`);

    const { onError } = options;
    return this[activeProvider].request$(requestId, options)
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
