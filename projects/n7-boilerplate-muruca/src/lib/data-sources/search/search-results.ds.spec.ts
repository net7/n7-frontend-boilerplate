import { TestBed } from '@angular/core/testing';
import { MrSearchResultsDS } from './search-results.ds';

describe('MrSearchResultsDS', () => {
  const dataSource = new MrSearchResultsDS();
  let mockDataSource: jasmine.SpyObj<MrSearchResultsDS>;
  const hlParams = {
    link: {
      params: 'root=1.4.2.46&hq=1',
      query_string: true
    }
  };
  const hlNoParams = {
    link: {
      absolute: 'http://wwww.domain.tld'
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
    const href = dataSource.getHighlightRelativeUrl(null, 'http://wwww.domain.tld');
    expect(href).toEqual('');
  });

  it('should be relative url with string parameter', () => {
    const hl = '/path/to/resource';
    const href = dataSource.getHighlightRelativeUrl(hl, 'http://wwww.domain.tld');
    expect(href).toEqual('http://wwww.domain.tld/path/to/resource');
  });

  it('should be relative url with relative param', () => {
    const href = dataSource.getHighlightRelativeUrl(hlRelativeNoParams.link, 'http://wwww.domain.tld');
    expect(href).toEqual('http://wwww.domain.tld/path/to/resource');
  });

  it('should be base url without relative path', () => {
    const href = dataSource.getHighlightRelativeUrl(hlParams.link, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i');
  });

  it('should be base url with params', () => {
    const href = dataSource.getHighlightParams(hlParams.link, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i?root=1.4.2.46&hq=1&');
  });

  it('should be base url with empty params', () => {
    const href = dataSource.getHighlightParams(hlNoParams.link, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i');
  });

  it('should be base url without query string', () => {
    const href = dataSource.getHighlightParams(hlNoParams.link, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i');
  });
  it('should be absolute url ', () => {
    const href = dataSource.getHighlightLink(hlAbsParams, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('http://wwww.domain.tld?root=1.4.2.46&hq=1');
  });

  it('should be base url with relative path and paramas', () => {
    const href = dataSource.getHighlightLink(hlRelativeParams, '/work/1661/de-viris-illustribus-i');
    expect(href).toEqual('/work/1661/de-viris-illustribus-i/path/to/resource?root=1.4.2.46&hq=1');
  });
});
