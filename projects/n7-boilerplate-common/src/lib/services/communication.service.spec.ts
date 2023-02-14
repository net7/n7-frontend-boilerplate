import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigCommonCommunication } from '@net7/boilerplate-common';
import { isEmpty } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';
import { ConfigurationService } from './configuration.service';
import { CommunicationService } from './communication.service';
import { RestProvider } from './communication-providers/rest.provider';
import { ApolloProvider } from './communication-providers/apollo.provider';

const validConfig: ConfigCommonCommunication = {
  defaultProvider: 'provider1',
  providers: {
    provider1: {
      type: 'rest',
      baseUrl: 'https://example.com/api/',
      config: {
        user: 'me'
      },
    },
    provider2: {
      type: 'rest',
      baseUrl: 'https://example.com/pippo/',
      config: {
        stats: 'statistiche'
      },
    },
    provider3: {
      type: 'apollo',
      baseUrl: 'https://example.com/apollo/',
      config: {
        friends: 'connectedWith'
      },
    }
  }
};

const notValidConfig: ConfigCommonCommunication = {
  defaultProvider: 'test',
  providers: {
    provider1: {
      type: 'rest',
      baseUrl: 'https://example.com/api/',
      config: {
        user: 'me'
      },
    }
  }
};

describe('CommunicationService with valid config', () => {
  let service : CommunicationService;
  let spyConfigurationService: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    spyConfigurationService = jasmine.createSpyObj('ConfigurationService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommunicationService,
        { provide: ConfigurationService, useValue: spyConfigurationService }]
    });
    spyConfigurationService.get.and.returnValue(validConfig);
    service = TestBed.inject(CommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return api baseUrl', () => {
    expect(service.getUrl()).toEqual('https://example.com/api/');
  });

  it('should return api url with defaultProvider', () => {
    expect(service.getUrl('user')).toEqual('https://example.com/api/me');
  });

  it('should return api url with provider', () => {
    expect(service.getUrl('stats', 'provider2')).toEqual('https://example.com/pippo/statistiche');
  });

  it('should throw requestId error', () => {
    expect(() => { service.getUrl('notExist'); }).toThrow(new Error('There is no config for "notExist"'));
  });

  it('should throw provider error', () => {
    expect(() => { service.getUrl('stats', 'test'); }).toThrow(new Error('There is no config for "test" provider'));
  });
});

describe('CommunicationService with not valid config', () => {
  let service : CommunicationService;
  let spyConfigurationService: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    spyConfigurationService = jasmine.createSpyObj('ConfigurationService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommunicationService,
        { provide: ConfigurationService, useValue: spyConfigurationService }]
    });
    spyConfigurationService.get.and.returnValue(notValidConfig);
    service = TestBed.inject(CommunicationService);
  });

  it('should throw activeProvider error', () => {
    expect(() => { service.getUrl('notValid'); }).toThrow(new Error('There is no config for "test" provider'));
  });
});

describe('CommunicationService handleError', () => {
  let service : CommunicationService;
  let spyConfigurationService: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    spyConfigurationService = jasmine.createSpyObj('ConfigurationService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommunicationService,
        { provide: ConfigurationService, useValue: spyConfigurationService }]
    });
    spyConfigurationService.get.and.returnValue(validConfig);
    service = TestBed.inject(CommunicationService);
  });

  it('should call onError when is passed as param', (done) => {
    let result;
    const onError = (err) => {
      result = `${err} handled!`;
    };
    service.handleError('oops', onError).pipe(
      isEmpty()
    ).subscribe(() => {
      expect(result).toEqual('oops handled!');
      done();
    });
  });

  it('should skip onError when param is null or undefined', (done) => {
    const handler1$ = service.handleError('oops', null).pipe(
      isEmpty()
    );
    const handler2$ = service.handleError('oops', undefined).pipe(
      isEmpty()
    );

    forkJoin([handler1$, handler2$]).subscribe(([res1, res2]) => {
      expect(res1).toBeTrue();
      expect(res2).toBeTrue();
      done();
    });
  });
});

describe('CommunicationService request$', () => {
  let service : CommunicationService;
  let spyConfigurationService: jasmine.SpyObj<ConfigurationService>;
  let spyRestProvider: jasmine.SpyObj<RestProvider>;
  let spyApolloProvider: jasmine.SpyObj<ApolloProvider>;

  beforeEach(() => {
    spyConfigurationService = jasmine.createSpyObj('ConfigurationService', ['get']);
    spyRestProvider = jasmine.createSpyObj('RestProvider', ['request$']);
    spyApolloProvider = jasmine.createSpyObj('ApolloProvider', ['request$']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        CommunicationService,
        { provide: ConfigurationService, useValue: spyConfigurationService },
        { provide: RestProvider, useValue: spyRestProvider },
        { provide: ApolloProvider, useValue: spyApolloProvider }
      ]
    });
    spyConfigurationService.get.and.returnValue(validConfig);
    spyRestProvider.request$.and.returnValue(of(true));
    spyApolloProvider.request$.and.returnValue(of(true));
    service = TestBed.inject(CommunicationService);
  });

  it('should throw provider error', () => {
    expect(() => {
      service.request$('stats', {
        method: 'GET'
      }, 'test');
    }).toThrow(new Error('There is no config for "test" provider'));
  });

  it('should throw type (retrocompatible) error', () => {
    validConfig.providers.socketio = {
      baseUrl: 'https://example.com/api/',
      config: {
        user: 'me'
      },
    };
    expect(() => {
      service.request$('user', {
        method: 'GET'
      }, 'socketio');
    }).toThrow(new Error('There is no "socketio" provider type'));
  });

  it('should call RestProvider request$ method', (done) => {
    service.request$('user').subscribe((response) => {
      expect(response).toBeTrue();
      done();
    });
  });

  it('should call ApolloProvider request$ method', (done) => {
    service.request$('friends', {
      method: 'POST'
    }, 'provider3').subscribe((response) => {
      expect(response).toBeTrue();
      done();
    });
  });
});
