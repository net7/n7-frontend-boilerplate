import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigurationService } from './configuration.service';
import { JsonConfigService } from './json-config.service';

const localConfig = {
  communication: {
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
        type: 'apollo',
        baseUrl: 'https://apollo-test.com/api/',
        config: {
          stats: 'stats'
        },
      },
    }
  }
};

const jsonConfig = {
  customer: 'Muruca Test',
  communication: {
    defaultProvider: 'provider1',
    providers: {
      provider1: {
        type: 'rest',
        baseUrl: 'https://another-example.com/api/',
        config: {
          user: 'utente',
          profile: 'profilo'
        },
      },
    }
  }
};

describe('JsonConfigService mergeConfigKey', () => {
  let service : JsonConfigService;
  let spyConfigurationService: jasmine.SpyObj<ConfigurationService>;

  beforeEach(() => {
    spyConfigurationService = jasmine.createSpyObj('ConfigurationService', ['get']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        JsonConfigService,
        { provide: ConfigurationService, useValue: spyConfigurationService }]
    });
    spyConfigurationService.get.and.returnValue(localConfig);
    service = TestBed.inject(JsonConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should merge strings', () => {
    expect(service.mergeConfigKey(undefined, jsonConfig.customer))
      .toBe('Muruca Test');

    expect(service.mergeConfigKey('Test app', undefined))
      .toBe('Test app');

    expect(service.mergeConfigKey('Test app', jsonConfig.customer))
      .toBe('Muruca Test');
  });

  it('should merge objects', () => {
    const result = service.mergeConfigKey(localConfig.communication, jsonConfig.communication);
    const { provider1 } = result.providers;
    expect(provider1.baseUrl).toBe('https://another-example.com/api/');
    expect(provider1.config.user).toBe('utente');
    expect(provider1.config.profile).toBe('profilo');
  });

  it('should overwrite mixed values', () => {
    expect(service.mergeConfigKey({ label: 'Test label' }, jsonConfig.customer))
      .toBe('Muruca Test');

    const result1 = service.mergeConfigKey({ label: 'Test label' }, undefined);
    expect(result1.label).toBe('Test label');

    const result2 = service.mergeConfigKey(undefined, { label: 'Another test label' });
    expect(result2.label).toBe('Another test label');
  });
});
