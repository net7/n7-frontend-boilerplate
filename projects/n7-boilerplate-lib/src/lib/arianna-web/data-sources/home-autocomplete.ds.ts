import { DataSource } from '@n7-frontend/core';

export class AwHomeAutocompleteDS extends DataSource {
  protected transform(data) {
    const { results, totalCount } = data,
      { config } = this.options,
      itemIds = [],
      groups = {
        'oggetto-culturale': {
          title: config['oggetto-culturale'].label,
          icon: config['oggetto-culturale'].icon,
          classes: `color-oggetto-culturale`,
          items: []
        }
      };

    results.forEach(({ item, entity }) => {
      const groupId = entity ? entity.typeOfEntity.replace(' ', '-') : 'oggetto-culturale',
        groupConfig = config[groupId],
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
            if (key === mainMetadata) {
              metadata.push({ key, value });
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
      fallback:
        'Spiacenti, non è stato trovato nessun risultato. <br> Riprova con una nuova ricerca.'
    };
  }
}
