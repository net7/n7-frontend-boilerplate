import { TestBed } from '@angular/core/testing';
import { MrSearchResultsDS } from './search-results.ds';

describe('MrSearchResultsDS', () => {
  const dataSource = new MrSearchResultsDS();
  let mockDataSource: jasmine.SpyObj<MrSearchResultsDS>;
  const hlParamsQs = {
    link: {
      params: 'root=1.4.2.46&hq=1',
      query_string: true
    }
  };
  const hlParams = {
    link: {
      params: 'root=1.4.2.46&hq=1',
    }
  };
  const hlNoParams = {
    link: {

    }
  };
  const hlRelativeNoParams = {
    link: {
      relative: '/path/to/resource'
    }
  };

  const hlRelativeParams = {
    link: {
      relative: '/path/to/resource',
      params: 'root=1.4.2.46&hq=1'
    }
  };
  const hlAbsParams = {
    link: {
      absolute: 'http://wwww.domain.tld',
      params: 'root=1.4.2.46&hq=1'
    }
  };
  beforeEach(() => {
    mockDataSource = jasmine.createSpyObj<MrSearchResultsDS>(['getHighlightLink']);
    mockDataSource.getHighlightLink.and.returnValue('/work/1661/de-viris-illustribus-i');
    TestBed.configureTestingModule({
      providers: [MrSearchResultsDS,
        {
          provide: MrSearchResultsDS, useValue: mockDataSource
        }]
    });
    mockDataSource = TestBed.inject(MrSearchResultsDS) as jasmine.SpyObj<MrSearchResultsDS>;
  });

  it('should be created', () => {
    expect(dataSource).toBeTruthy();
  });

  it('should be link empty', () => {
    const href = dataSource.getHighlightLink({}, 'http://wwww.domain.tld');
    expect(href).toEqual('');
  });

  it('should be relative url with string parameter', () => {
    const hl = { link: '/path/to/resource' };
    const href = dataSource.getHighlightLink(hl, 'http://wwww.domain.tld');
    expect(href).toEqual('http://wwww.domain.tld/path/to/resource');
  });

  it('should be relative url with relative param', () => {
    const href = dataSource.getHighlightLink(hlRelativeNoParams, 'http://wwww.domain.tld');
    expect(href).toEqual('http://wwww.domain.tld/path/to/resource');
  });

  it('should be base url with params', () => {
    const href = dataSource.getHighlightLink(hlParams, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i?root=1.4.2.46&hq=1');
  });

  it('should be base url with params and q-params', () => {
    const href = dataSource.getHighlightLink(hlParamsQs, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i?root=1.4.2.46&hq=1&');
  });

  it('should be base url without query string', () => {
    const href = dataSource.getHighlightLink(hlNoParams, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i');
  });
  it('should be absolute url with params ', () => {
    const href = dataSource.getHighlightLink(hlAbsParams, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('http://wwww.domain.tld?root=1.4.2.46&hq=1');
  });

  it('should be base url with relative path and paramas', () => {
    const href = dataSource.getHighlightLink(hlRelativeParams, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i/path/to/resource?root=1.4.2.46&hq=1');
  });
});
