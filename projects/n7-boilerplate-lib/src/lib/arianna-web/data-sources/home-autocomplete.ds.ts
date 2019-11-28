import { DataSource } from '@n7-frontend/core';

export class AwHomeAutocompleteDS extends DataSource {

  protected transform(data){

    const { entities, totalCount } = data,
          { config } = this.options;

    let itemIds = [],
      groups = {};
    console.log(entities);
    entities.forEach(
      ({ entity, count }) => {
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
        let metaDataValue: any;
        if (entity.fields){
          const meta = config[entity.typeOfEntity.replace(" ", "-")]['main-metadata'];
          entity.fields.forEach(infoData => {
            if( infoData.key === meta) metaDataValue = { key: infoData.key, value: infoData.value };
          });
        }
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

    const results = Object.keys(groups).map(key => ({ 
      group: {
        title: groups[key].title,
        icon: groups[key].icon,
        classes: groups[key].classes,
      }, 
      items: groups[key].items 
    }));
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