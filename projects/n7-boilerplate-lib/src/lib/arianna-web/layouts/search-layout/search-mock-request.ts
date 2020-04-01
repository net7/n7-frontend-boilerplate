/* eslint-disable */
import { Observable, of } from 'rxjs';

export default (params, configKeys, enabledEntities): Observable<any> => {
  params.totalCount = Math.floor(Math.random() * 1000);

  console.log('fake-search-request----------->', params);

  const { facets } = params;

  // query links
  _getFacet('query-links', facets).data = _getQueryLinksData(configKeys, enabledEntities);

  // entity types
  _getFacet('entity-types', facets).data = _getEntityTypesData(configKeys, enabledEntities);

  // entity links
  _getFacet('entity-links', facets).data = _getEntityLinksData();

  // date from
  _getFacet('date-from', facets).data = _getDateFromData();

  // date to
  _getFacet('date-to', facets).data = _getDateToData();

  return of(params);
};

const _getFacet = (id, facets) => facets.filter((f) => f.id === id)[0];

const _getQueryLinksData = (configKeys, enabledEntities) => enabledEntities.map((key) => {
  const config = configKeys[key];
  return {
    value: key,
    label: config.label,
    counter: Math.floor(Math.random() * 100),

    // questi vanno aggiunti a mano lato front-end
    options: {
      icon: config.icon,
      classes: `color-${key}`,
    },
  };
});

const _getEntityTypesData = (configKeys, enabledEntities) => enabledEntities.map((key) => {
  const config = configKeys[key];
  return {
    value: key,
    label: config.label,
  };
});

const _getDateFromData = () => ['1990', '1991', '1992', '1993'].map((key) => ({
  value: key,
  label: key,
}));

const _getDateToData = () => ['2000', '2001', '2002', '2003'].map((key) => ({
  value: key,
  label: key,
}));

const _getEntityLinksData = () => {
  const types = ['places', 'places', 'concepts', 'people', 'people'];
  const items = ['milano', 'roma', 'spazio', 'rodolfo-marna', 'alighiero-boetti'];

  return items.map((key, index) => {
    const label = key.replace('-', ' ');
    return {
      value: key,
      label,
      counter: Math.floor(Math.random() * 100),
      metadata: {
        title: label,
        'entity-type': types[index],
      },
    };
  });
};
