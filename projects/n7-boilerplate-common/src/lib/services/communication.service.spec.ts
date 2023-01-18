import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigCommonCommunication } from '@net7/boilerplate-common';
import { ConfigurationService } from './configuration.service';
import { CommunicationService } from './communication.service';

describe('CommunicationService whit valid config', () => {
  const config: ConfigCommonCommunication = {
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
      }
    }
  };

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
    spyConfigurationService.get.and.returnValue(config);
    service = TestBed.inject(CommunicationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
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

describe('CommunicationService whit not valid config', () => {
  const config: ConfigCommonCommunication = {
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
    spyConfigurationService.get.and.returnValue(config);
    service = TestBed.inject(CommunicationService);
  });

  it('should throw activeProvider error', () => {
    expect(() => { service.getUrl('notValid'); }).toThrow(new Error('There is no config for "test" provider'));
  });
});
