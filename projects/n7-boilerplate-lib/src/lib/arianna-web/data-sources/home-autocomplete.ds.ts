import { DataSource } from '@n7-frontend/core';
import { ADVANCED_AUTOCOMPLETE_MOCK } from '@n7-frontend/components';

export class AwHomeAutocompleteDS extends DataSource {

  protected transform(data){

    const { entities, totalCount } = data,
          { config } = this.options;

    let itemIds = [],
      groups = {};

    entities.forEach(
      ({ entity, count }) => {
        console.log(entity);
      if(!groups[entity.typeOfEntity]) {
        const { label, icon } = config[entity.typeOfEntity.replace(" ", "-")];
        groups[entity.typeOfEntity.replace(" ", "-")] = {
          title: label,
          icon,
          classes: `color-${entity.typeOfEntity.replace(" ", "-")}`,
          items: [],
        };
      }

      if(itemIds.indexOf(entity.id) === -1){
        let metaDataValue: string = ' ';
        /*entity.info.forEach(infoData => {
          if(infoData.key === 'author') metaDataValue = `di ${infoData.value}`;
        });*/
        groups[entity.typeOfEntity.replace(" ", "-")].items.push({
          label: entity.label,
          value: metaDataValue,
          payload: {
            source: 'item',
            id: entity.id
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