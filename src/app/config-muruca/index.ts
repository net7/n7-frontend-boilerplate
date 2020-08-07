import layouts from './layouts';
import communicationConfig from './communication.config';
import headerConfig from './header.config';
import footerConfig from './footer.config';
import i18nConfig from './i18n.config';
import labelsConfig from './labels.config';

export default {
  name: 'Totus Mundus',
  communication: communicationConfig,
  header: headerConfig,
  footer: footerConfig,
  i18n: i18nConfig,
  labels: labelsConfig,
  ...layouts
};
