import { DataSource } from '@n7-frontend/core';
import { ItemPreviewData } from '@n7-frontend/components';

export class AwRelatedEntitiesDS extends DataSource {
  protected transform = (data) => {
    const previews: ItemPreviewData[] = data.map((d) => ({
      title: d.entity.label,
      text: d.id,
      anchor: { href: `/aw/entita/${d.entity.id}/${d.entity.label}`, target: '_blank' }, // TODO: Add base url path
      classes: `color-${d.entity.typeOfEntity}`,
      metadata: [{
        items: [{
          label: 'Tipo',
          value: d.entity.typeOfEntity,
          icon: this.iconMap(d.entity.typeOfEntity)
        }]
      }]
    }));
    return { previews };
  };

  private iconMap = (type) => {
    switch (type) {
      case 'persona':
        return 'n7-icon-biography';
        break;
      case 'luogo':
        return 'n7-icon-map1';
        break;
      case 'organizzazione':
        return 'n7-icon-building';
        break;
      default:
        return '';
        break;
    }
  }
}
