import helpers from '../../common/helpers';

const metadataIsEmpty = (value) => (!value || value === 'null');

const isLink = (fields: any[]) => !!fields.filter(({ key }) => key === 'isLink').length;

const isRepeater = (fields: any[]) => Array.isArray(fields);

const getLink = (fields: any[], paths) => {
  const schedaTypes = ['oggetto-culturale', 'aggregazione-logica'];
  const label = fields.find(({ key }) => key === 'label').value;
  const slug = helpers.slugify(label);
  const id = fields.find(({ key }) => key === 'id').value;
  const type = fields.find(({ key }) => key === 'type').value;
  let basePath = paths.entitaBasePath;
  if (schedaTypes.includes(type)) {
    basePath = paths.schedaBasePath;
  }
  return `<a href="${basePath}${id}/${slug}" target="_blank">${label}</a>`;
};

const getRepeater = (fields: any[], labels, metadataToShow, type) => {
  const html = [];
  fields
    .filter(({ key, value }) => metadataToShow.includes(key) && !metadataIsEmpty(value))
    .map(({ key, value }) => ({
      key,
      value,
      order: metadataToShow.indexOf(key),
      label: helpers.prettifySnakeCase(key, labels[`${type}.${key}`])
    }))
    .sort((a, b) => a.order - b.order)
    .forEach(({ label, value }) => {
      html.push(`<dt>${label}</dt>`);
      html.push(`<dd>${value}</dd>`);
    });
  return html.length
    ? `<dl>${html.join('')}</dl>`
    : null;
};

export default {
  normalize: ({
    fields: data,
    paths,
    labels,
    metadataToShow,
    type
  }) => {
    const result = [];
    if (Array.isArray(data)) {
      data.forEach(({
        key, value, label, fields
      }) => {
        // link & repeater control
        if (fields && Array.isArray(fields)) {
          if (isLink(fields)) {
            result.push({ key: label, value: getLink(fields, paths) });
          } else if (isRepeater(fields)) {
            result.push({ key: label, value: getRepeater(fields, labels, metadataToShow, type) });
          }
          // default
        } else {
          result.push({ key, value });
        }
      });
    }
    return result
      .filter(({ key, value }) => metadataToShow.includes(key) && !metadataIsEmpty(value))
      .map(({ key, value }) => ({
        key,
        value,
        order: metadataToShow.indexOf(key),
        label: helpers.prettifySnakeCase(key, labels[`${type}.${key}`]),
      }))
      .sort((a, b) => a.order - b.order);
  }
};
