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
    } catch(err) {
      throw Error('No communications.defaultProvider setted in config');
    }
  }

  request$(requestId, options: any = {}, provider?){
    provider = provider || this.defaultProvider;
    if(!this[provider]) throw Error(`There is no ${provider} provider`);

    const { onError } = options;
    return this[provider].request$(requestId, options)
      .pipe(
        catchError((error) => this.handleError(error, onError))
      );
  }

  handleError(error, onError): Observable<any> {
    onError = onError || this.communicationConfig.onError;
    
    if(onError){
      onError(error);
    } else {
      console.warn('No default error handler for communication service', error);
    }

    return empty();
  }
}