import { Observable, of } from 'rxjs';

export default (params, configKeys): Observable<any> => {
  params.totalCount = Math.floor(Math.random() * 1000);

  console.log('fake-search-request----------->', params);

  let { facets } = params;

  // query links
  _getFacet('query-links', facets).data = _getQueryLinksData(configKeys);

  // entity types
  _getFacet('entity-types', facets).data = _getEntityTypesData(configKeys);

  // entity links
  _getFacet('entity-links', facets).data = _getEntityLinksData();

  // date from
  _getFacet('date-from', facets).data = _getDateFromData();
  
  // date to
  _getFacet('date-to', facets).data = _getDateToData();
  
  return of(params);
}

const _getFacet = (id, facets) => {
  return facets.filter(f => f.id === id)[0];
}

const _getQueryLinksData = (configKeys) => {
  return Object.keys(configKeys).map(key => {
    const config = configKeys[key];
    return {
      value: key,
      label: config.label,
      counter: Math.floor(Math.random() * 100),
      
      // questi vanno aggiunti a mano lato front-end
      options: {
        icon: config.icon,
        classes: `color-${key}`
      }
    };
  });
}

const _getEntityTypesData = (configKeys) => {
  return Object.keys(configKeys).map(key => {
    const config = configKeys[key];
    return {
      value: key,
      label: config.label,
    };
  });
}

const _getDateFromData = () => {
  return ['1990', '1991', '1992', '1993'].map(key => {
    return {
      value: key,
      label: key,
    };
  });
}

const _getDateToData = () => {
  return ['2000', '2001', '2002', '2003'].map(key => {
    return {
      value: key,
      label: key,
    };
  });
}

const _getEntityLinksData = () => {
  const types = ['places', 'places', 'concepts', 'people', 'people'];
  const items = ['milano', 'roma', 'spazio', 'rodolfo-marna', 'alighiero-boetti'];

  return items.map((key, index) => {
    const label = key.replace('-', ' ');
    return {
      value: key,
      label: label,
      counter: Math.floor(Math.random() * 100),
      metadata: {
        title: label,
        'entity-type': types[index]
      }  
    }
  });
}