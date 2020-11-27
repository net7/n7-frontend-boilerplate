import layouts from './layouts';
import communicationConfig from './communication.config';
import headerConfig from './header.config';
import footerConfig from './footer.config';
import labelsConfig from './labels.config';

export default {
  name: 'Petrarca',
  communication: communicationConfig,
  body: {
    classes: 'has-transparent-header petrarca-app'
  },
  header: headerConfig,
  footer: footerConfig,
  labels: labelsConfig,
  ...layouts
};
