import { ConfigAriannaItemPreview } from '@n7-frontend/boilerplate';

const config: ConfigAriannaItemPreview = {
  image: 'image',
  title: {
    data: 'item.label',
    maxLength: 80
  },
  text: {
    data: 'item.label',
    maxLength: 50
  },
  metadata: {
    info: {
      selection: [
        {
          key: 'fase'
        },
        {
          key: 'intitolazione'
        }
      ],
      data: 'item.fields',
      value: 'value',
      label: 'key',
      customLabel: ''
    },
    toe: {
      data: 'relatedTypesOfEntity',
      value: 'count',
      icon: 'type'
    },
    breadcrumbs: {
      data: 'breadcrumbs',
      label: 'label',
      payload: 'link'
    }
  },
  payload: 'item.id',
  paginationLimit: 5
};

export default config;
