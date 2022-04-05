const extractQueryParams = (queryParams: string) => {
  const params = {};
  queryParams.split('&').forEach((param) => {
    const [key, value] = param.split('=');
    params[key] = value;
  });
  return params;
};

export default {
  getQueryParams(href: string) {
    const queryParams = href.split('?')[1] ? extractQueryParams(href.split('?')[1]) : null;
    return this.isExternalLink(href) ? null : queryParams;
  },
  getRouterLink(href: string) {
    return this.isExternalLink(href) ? href : href.split('?')[0];
  },
  isExternalLink(href: string) {
    return /^http(?:s)?:\/{2}\S+$/.test(href);
  }
};
