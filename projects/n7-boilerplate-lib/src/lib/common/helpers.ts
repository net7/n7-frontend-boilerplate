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
  },
  browserIsIE() {
    return window.navigator.userAgent.match(/(MSIE|Trident)/);
  },
  escapeDoubleQuotes(str) {
    return str.replace(/\\([\s\S])|(")/g,"\\$1$2"); // thanks @slevithan!
  },
  unescapeDoubleQuotes(str) {
    if (str && str != "")
      str = str.replace(/\\(")/g,"$1"); // thanks @slevithan!

    return str;
  }

};
