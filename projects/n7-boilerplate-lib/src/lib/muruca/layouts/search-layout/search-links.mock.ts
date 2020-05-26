import config from './search-config.mock';

function getHeaders() {
  const headers = {};
  config.facets.sections.forEach(({ header }) => {
    headers[header.id] = Math.round(Math.random() * 100);
  });
  return headers;
}

function getLinks(prefix) {
  let i;
  const limit = 10;
  const links = [];
  for (i = 0; i < limit; i += 1) {
    const text = `${prefix} ${i + 1}`;
    links.push({
      text,
      counter: Math.round(Math.random() * 100),
      payload: text
    });
  }
  return links;
}

export default () => {
  const results = {};
  config.facets.sections.forEach(({ inputs }) => {
    inputs
      .filter((input) => input.type === 'link')
      .forEach(({ id }) => {
        results[id] = getLinks(id);
      });
  });
  return {
    headers: getHeaders(),
    inputs: results,
  };
};
