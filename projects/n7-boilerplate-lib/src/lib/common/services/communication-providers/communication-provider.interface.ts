import { Observable } from 'rxjs';

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

export interface RestOptions {
  params?: object;
  httpOptions?: any;
  /** Params to append to the baseURL */
  urlParams?: string;
  method?: HttpMethod;
  onError: (e: any) => void;
}

export interface ProviderConfig {
  defaultMethod?: HttpMethod;
  baseUrl: string;
  config: {
    [key: string]: string;
  };
}

export type Request = (
  requestId: string,
  options?: RestOptions,
  providerConfig?: ProviderConfig
) => Observable<any>;

export interface CommunicationProvider {
  request$: Request;
}
