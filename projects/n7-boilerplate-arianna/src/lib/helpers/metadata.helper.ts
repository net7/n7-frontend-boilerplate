import { helpers } from '@net7/boilerplate-common';

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
  return `<a href="${basePath}${id}/${slug}">${label}</a>`;
};

const getRepeater = (fields: any[], labels, metadataToShow, type, parentLabel, paths) => {
  const html = [];
  fields
    .filter(({ fields: subFields }) => subFields)
    .forEach(({ fields: subFields }) => {
      const subHtml = [];
      if (isLink(subFields)) {
        subHtml.push('<div>');
        subHtml.push(`<dd>${getLink(subFields, paths)}</dd>`);
        subHtml.push('</div>');
      }
      subFields
        .filter(({ key }) => {
          if (isLink(subFields)) {
            return !(['label', 'id', 'type', 'isLink'].includes(key));
          }
          return true;
        })
        .filter(({ key, value }) => metadataToShow.includes(`${parentLabel}.${key}`) && !metadataIsEmpty(value))
        .map(({ key, value }) => ({
          key,
          value,
          order: metadataToShow.indexOf(`${parentLabel}.${key}`),
          label: helpers.prettifySnakeCase(key, labels[`${type}.${parentLabel}.${key}`])
        }))
        .sort((a, b) => a.order - b.order)
        .forEach(({ label, value }) => {
          subHtml.push('<div>');
          subHtml.push(`<dt>${label}</dt>`);
          subHtml.push(`<dd>${value}</dd>`);
          subHtml.push('</div>');
        });

      if (subHtml.length) {
        html.push(`<dl>${subHtml.join('')}</dl>`);
      }
    });
  return html.length ? html.join('') : null;
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
          } else if (isRepeater(fields) && metadataToShow.includes(label)) {
            result.push({
              key: label,
              value: getRepeater(fields, labels, metadataToShow, type, label, paths)
            });
          }
          // default
        } else if (metadataToShow.includes(key)) {
          result.push({ key, value });
        }
      });
    }
    return result
      .filter(({ value }) => !metadataIsEmpty(value))
      .map(({ key, value }) => ({
        key,
        value,
        order: metadataToShow.indexOf(key),
        label: helpers.prettifySnakeCase(key, labels[`${type}.${key}`]),
      }))
      .sort((a, b) => a.order - b.order);
  }
};
