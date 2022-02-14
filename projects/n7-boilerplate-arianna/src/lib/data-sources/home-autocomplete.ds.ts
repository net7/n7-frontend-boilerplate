import { DataSource } from '@net7/core';
import { helpers } from '@net7/boilerplate-common';

export class AwHomeAutocompleteDS extends DataSource {
  protected transform(data) {
    const { response, query } = data;
    const { results, totalCount } = response;
    const { keys, config, paths } = this.options;
    const labels = this.options.labels || {};
    const itemIds = [];
    const groups = {};

    results.forEach(({ item, entity }) => {
      const groupId = entity ? entity.typeOfEntity : item.document_type;
      const groupConfig = keys[groupId];
      const mainMetadata = groupConfig['main-metadata'];
      const currentItem = item || entity;

      if (!groups[groupId]) {
        const { label, icon } = groupConfig;
        groups[groupId] = {
          title: label,
          icon,
          classes: `color-${groupConfig['class-name']}`,
          items: [],
          type: groupId,
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
          anchor: {
            href: `${paths[entity ? 'entitaBasePath' : 'schedaBasePath']}/${currentItem.id}/${helpers.slugify(currentItem.label)}`,
          },
        });
      }
    });

    const grouplist = Object.keys(groups).map((key) => ({
      group: {
        title: groups[key].title,
        icon: groups[key].icon,
        classes: groups[key].classes,
      },
      items: groups[key].items,
    }));

    return {
      results: grouplist,
      actions: grouplist.length > 0 ? {
        showMore: {
          text: `Visualizza tutti i ${totalCount} risultati`,
          anchor: {
            href: paths.searchBasePath,
            queryParams: {
              query,
            },
          },
        },
      } : {
        showMore: {
          text: 'Cerca in tutti i campi',
          anchor: {
            href: paths.searchBasePath,
            queryParams: {
              query, // Query string
              'query-all': 1, // "Cerca in tutti i campi delle schede"
            },
          },
        },
      },
      fallback: ((config.get('home-layout') || {})['top-hero'] || {}).fallback,
    };
  }
}
