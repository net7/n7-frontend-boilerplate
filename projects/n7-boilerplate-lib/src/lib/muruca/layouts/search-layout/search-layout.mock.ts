import searchFacets from './search-facets.config';

function getHeaders() {
  const headers = {};
  searchFacets.sections.forEach(({ header }) => {
    headers[header.id] = Math.round(Math.random() * 100);
  });
  return headers;
}

export default (page, sort) => ({
  sort,
  totalCount: Math.round(Math.random() * 1000),
  page: { current: page, limit: 10 },
  headers: getHeaders(),
  results: [
    {
      image: 'https://i.imgur.com/52UFqca.png',
      title: 'Yudi Shanhai Quantu',
      text: 'Complete Map of all mountains and seas',
    }, {
      image: 'https://i.imgur.com/52UFqca.png',
      title: 'World Map based on Matteo Ricci 1850',
      text: 'Complete Map fo all mountains and seas',
    }, {
      image: '',
      title: 'Reconstruction of D\'Elia\'s map',
      text: 'A digital collage of the map portions from Pasquale D\'Elia "mappamondo"',
    }, {
      image: '',
      title: 'Unattributed version',
      text: 'A japanese colored version',
    }, {
      image: '',
      title: 'Matteo Ricci\'s way from Macau to Beijing',
      text: 'A japanese colored version',
    }, {
      image: '',
      title: 'The 400-year-old map that shows China as the centre of the world',
      text: 'A japanese colored version',
    }, {
      image: 'https://i.imgur.com/52UFqca.png',
      title: 'Yudi Shanhai Quantu',
      text: 'Complete Map of all mountains and seas',
    }, {
      image: 'https://i.imgur.com/52UFqca.png',
      title: 'World Map based on Matteo Ricci 1850',
      text: 'Complete Map fo all mountains and seas',
    }, {
      image: '',
      title: 'Reconstruction of D\'Elia\'s map',
      text: 'A digital collage of the map portions from Pasquale D\'Elia "mappamondo"',
    }, {
      image: '',
      title: 'Unattributed version',
      text: 'A japanese colored version',
    }, {
      image: '',
      title: 'Matteo Ricci\'s way from Macau to Beijing',
      text: 'A japanese colored version',
    }, {
      image: '',
      title: 'The 400-year-old map that shows China as the centre of the world',
      text: 'A japanese colored version',
    }
  ]
});
