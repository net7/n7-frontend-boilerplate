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
    let parsedString = parsedDoc.body.textContent || '';
    // custom replacements
    parsedString = parsedString.replace(/\//g, '-');
    return slugify(parsedString, {
      remove: /[*+~.()'"!:@,]/g,
      lower: true
    });
  },
  browserIsIE() {
    return window.navigator.userAgent.match(/(MSIE|Trident)/);
  },
  escapeQuotes(str) {
    if (typeof str !== 'string') {
      return '';
    }
    return str
      .replace(/"/g, '\\\\\\"')
      .replace(/'/g, '\\\\\'');
  },
  unescapeQuotes(str) {
    if (typeof str !== 'string') {
      return '';
    }
    return str
      .replace(/\\\\\\"/g, '"')
      .replace(/\\\\'/g, '\'');
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
  striptags(str) {
    if (typeof str !== 'string') {
      return '';
    }
    return str.replace(/(<([^>]+)>)/gi, '');
  },
  isElementInViewport(el: HTMLElement): boolean {
    if (!el) {
      throw Error('There is no element');
    }
    const rect = el.getBoundingClientRect();

    return rect.bottom > 0
        && rect.right > 0
        && rect.left < (window.innerWidth || document.documentElement.clientWidth)
        && rect.top < (window.innerHeight || document.documentElement.clientHeight);
  }
};
