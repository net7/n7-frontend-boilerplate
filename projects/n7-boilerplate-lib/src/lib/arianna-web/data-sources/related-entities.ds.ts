import { DataSource } from '@n7-frontend/core';
import { ItemPreviewData } from '@n7-frontend/components';

export class AwRelatedEntitiesDS extends DataSource {
  protected transform = (data): { previews: ItemPreviewData[] } => {
    const basePath = this.options.config.get('paths').entitaBasePath;
    const previews: ItemPreviewData[] = data ? data.map((d) => ({
      title: d.entity.label,
      anchor: {
        href: `${basePath}${d.entity.id}/${d.entity.label}`,
      },
      classes: `is-${d.entity.typeOfEntity}`, // adds color to the title
      metadata: [{
        items: [{
          label: 'Tipo di entità',
          value: d.entity.typeOfEntity,
        }, {
          label: d.entity.relationName || (d.entity.relation && 'Relazione'),
          value: d.entity.relation || null
        }]
      }]
    })) : [];
    return { previews };
  };
}
