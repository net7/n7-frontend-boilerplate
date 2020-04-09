// eslint-disable-next-line import/no-extraneous-dependencies
import slugify from 'slugify';

const domParser = new DOMParser();

export default {
  prettifySnakeCase(key: string, label?: string) {
    if (typeof label === 'string') {
      return label;
    }
    return (key || '').split('_').map((word, index) => (index === 0 ? this.ucFirst(word) : word)).join(' ');
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
    return slugify(parsedString, {
      remove: /[*+~.()'"!:@,]/g,
      lower: true
    });
  },
  browserIsIE() {
    return window.navigator.userAgent.match(/(MSIE|Trident)/);
  },
  escapeDoubleQuotes(str) {
    if (str.search(/\\?(")([\w\s]+)\\?(")/g) >= 0) {
      // match piece of string between double quotes
      return str.replace(/\\?(")([\w\s]+)\\?(")/g, '\\$1$2\\$3'); // thanks @slevithan!
    }
    return str.replace(/\\([\s\S])|(")/g, '\\\\\\$1$2'); // thanks @slevithan!
  },
  unescapeDoubleQuotes(str) {
    return (str && str !== '') ? str.replace(/\\*(")/g, '$1') : str; // thanks @slevithan!
  },

};
