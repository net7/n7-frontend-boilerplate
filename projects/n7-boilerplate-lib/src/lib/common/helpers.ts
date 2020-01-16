export default {
  prettifySnakeCase(key: string, label?: string) {
    if (label) {
      return label;
    }
    return (key || '').split('_').map((word, index) => index === 0 ? this.ucFirst(word) : word).join(' ');
  },
  ucFirst(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
};
