import { DataSource } from '@n7-frontend/core';
import { ItemPreviewData } from '@n7-frontend/components';

export class AwRelatedEntitiesDS extends DataSource {
  protected transform = (data) => {
    const basePath = this.options.config.get('paths').entitaBasePath;
    const previews: ItemPreviewData[] = data.map((d) => ({
      title: d.entity.label,
      anchor: {
        href: `${basePath}${d.entity.id}/${d.entity.label}`,
        target: '_blank'
      },
      classes: `is-${d.entity.typeOfEntity}`, // adds color to the title
      metadata: [{
        items: [{
          label: 'Tipo di entità',
          value: d.entity.typeOfEntity,
        }]
      }]
    }));
    return { previews };
  };
}
