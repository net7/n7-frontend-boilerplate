import layouts from './layouts';
import communicationConfig from './communication.config';
import headerConfig from './header.config';
import footerConfig from './footer.config';
import labelsConfig from './labels.config';

export default {
  name: 'Petrarca',
  communication: communicationConfig,
  header: headerConfig,
  footer: footerConfig,
  labels: labelsConfig,
  ...layouts
};
