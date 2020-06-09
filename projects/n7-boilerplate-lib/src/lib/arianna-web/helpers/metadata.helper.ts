import helpers from '../../common/helpers';

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
const getRepeater = (fields: any[]) => {
  const html = [];
  html.push('<dl>');
  fields.forEach(({ key, value }) => {
    html.push(`<dt>${key}</dt>`);
    html.push(`<dd>${value}</dd>`);
  });
  html.push('</dl>');
  return html.join();
};

export default {
  normalize: (data: any[], paths) => {
    const result = [];
    if (Array.isArray(data)) {
      data.forEach(({
        key, value, label, fields
      }) => {
        if (fields && Array.isArray(fields)) {
          if (isLink(fields)) {
            result.push({ key: label, value: getLink(fields, paths) });
          } else if (isRepeater(fields)) {
            result.push({ key: label, value: getRepeater(fields) });
          }
        } else {
          result.push({ key, value });
        }
      });
    }
    return result;
  }
};
