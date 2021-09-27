import { ConfigAriannaCollectionLayout } from '@n7-frontend/boilerplate';

const config: ConfigAriannaCollectionLayout = {
  header: {
    maxLength: 100,
    char: '…',
  },
  description: {
    // maxLength: 20,
    char: '…',
  },
  watermark: 'assets/collection-watermark.png',
  item: {
    title: {
      maxLength: 80,
      char: '…'
    },
    description: {
      maxLength: 100,
      char: '…'
    }
  }
};

export default config;
