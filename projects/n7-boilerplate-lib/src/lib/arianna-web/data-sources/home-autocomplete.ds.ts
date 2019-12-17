import { DataSource } from '@n7-frontend/core';
import helpers from '../../common/helpers';

export class AwHomeAutocompleteDS extends DataSource {
  protected transform(data) {
    const { results, totalCount } = data,
          { keys, config } = this.options,
          labels = this.options.labels || {},
          itemIds = [],
          groups = {};

    results.forEach(({ item, entity }) => {
      const groupId = entity ? entity.typeOfEntity.replace(' ', '-') : 'oggetto-culturale',
        groupConfig = keys[groupId],
        mainMetadata = groupConfig['main-metadata'],
        currentItem = item || entity;

      if (!groups[groupId]) {
        const { label, icon } = groupConfig;
        groups[groupId] = {
          title: label,
          icon,
          classes: `color-${groupId}`,
          items: []
        };
      }

      if (itemIds.indexOf(currentItem.id) === -1) {
        const metadata = [];
        if (currentItem.fields) {
          currentItem.fields.forEach(({ key, value }) => {
            if (mainMetadata && key === mainMetadata) {
              metadata.push({ key: helpers.prettifySnakeCase(key, labels[key]), value });
            }
          });
        }
        groups[groupId].items.push({
          title: currentItem.label,
          metadata,
          payload: {
            source: 'item',
            id: currentItem.id
          }
        });
      }
    });

    return {
      results: Object.keys(groups).map(key => ({
        group: {
          title: groups[key].title,
          icon: groups[key].icon,
          classes: groups[key].classes
        },
        items: groups[key].items
      })),
      actions: {
        showMore: {
          text: `Visualizza tutti i ${totalCount} risultati`,
          payload: {
            source: 'showMore'
          }
        }
      },
      fallback: ((config.get('home-layout') || {})["top-hero"] || {}).fallback
    };
  }
}
