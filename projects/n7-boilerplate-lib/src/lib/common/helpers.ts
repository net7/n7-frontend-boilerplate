import slug from 'slug';

const domParser = new DOMParser();

export default {
  prettifySnakeCase(key: string, label?: string) {
    if (label) {
      return label;
    }
    return (key || '').split('_').map((word, index) => index === 0 ? this.ucFirst(word) : word).join(' ');
  },
  ucFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  },
  slugify(str: string) {
    if (!str) {
      return '';
    }
    const parsedDoc = domParser.parseFromString(str, 'text/html');
    const parsedString = parsedDoc.body.textContent || '';
    return slug(parsedString, { lower: true });
  }
};
