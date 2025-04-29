import { DataSource } from '@net7/core';
import { ItemPreviewData } from '@net7/components';

export class AwRelatedEntitiesDS extends DataSource {
  protected transform = (data): { previews: ItemPreviewData[] } => {
    const basePath = this.options.config.get('paths').entitaBasePath;
    const configKeys = this.options.config.get('config-keys');
    const { title } = this.options;
    const previews: ItemPreviewData[] = data ? data.map((d) => ({
      title: d.entity.label,
      anchor: {
        href: `${basePath}${d.entity.id}/${d.entity.label}`,
      },
      classes: (configKeys[d.entity.typeOfEntity])
        ? `is-${configKeys[d.entity.typeOfEntity]['class-name']}`
        : null, // adds color to the title
      metadata: [{
        items: [{
          label: 'Tipo di entità',
          value: (configKeys[d.entity.typeOfEntity])
            ? configKeys[d.entity.typeOfEntity].label
            : d.entity.typeOfEntity,
        }],
      }],
      // A special kind of metadata, not to be viewed as other metadata
      relation: {
        key: d.relationName || title,
        value: d.entity.relation || null
      },
      qualification: {
        key: d.relationName || title,
        value: d.entity.qualification || null
      },
    })) : [];
    return { previews };
  };
}
