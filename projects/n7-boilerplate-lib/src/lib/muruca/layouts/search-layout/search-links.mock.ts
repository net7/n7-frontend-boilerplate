import config from './search-config.mock';

function getLinks(prefix) {
  let i;
  const limit = Math.round(Math.random() * 10);
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
  config.facets.sections.forEach(({ header }) => {
    results[header.id] = getLinks(header.data.text);
  });
  return results;
};
