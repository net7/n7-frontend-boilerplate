import { DataSource } from '@n7-frontend/core';
import { ADVANCED_AUTOCOMPLETE_MOCK } from '@n7-frontend/components';

export class AwHomeAutocompleteDS extends DataSource {

  protected transform(data){

    const { items, totalCount } = data,
      { config } = this.options;

    let itemIds = [],
      groups = {};

    items.forEach(({ item, typeOfEntity }) => {
      if(!groups[typeOfEntity.id]) {
        const { label, icon } = config[typeOfEntity.configKey];
        groups[typeOfEntity.id] = {
          title: label,
          icon,
          classes: `color-${typeOfEntity.configKey}`,
          items: [],
        };
      }

      if(itemIds.indexOf(item.id) === -1){
        let metaDataValue: string = '';
        item.info.forEach(infoData => {
          if(infoData.key === 'author') metaDataValue = `di ${infoData.value}`;
        });
        groups[typeOfEntity.id].items.push({
          label: item.label, 
          value: metaDataValue, 
          payload: { 
            source: 'item',
            id: item.id 
          }
        });
      }
    });

    const results = Object.keys(groups).map(key => ({ group: {...groups[key]} }));
    return { 
      results,
      actions: {
        showMore: {
          text: `Visualizza tutti i ${totalCount} risultati`,
          payload: { 
            source: 'showMore' 
          }
        }
      },
      fallback: 'Spiacenti, non è stato trovato nessun risultato. <br> Riprova con una nuova ricerca.'
    };
  }
}