import { DataSource } from '@n7-frontend/core';

export class AwEntitaNavDS extends DataSource {

  protected transform(data){
    if (!data) return;
    const navigation = { items: [], payload: 'entita-nav' }
    navigation.items.push({ text: 'OVERVIEW', payload: 'overview'})
    if (data.fieldsTab) {
      navigation.items.push({ text: 'CAMPI', payload: 'campi'})
    }
    if (data.items) {
      navigation.items.push({ text: 'OGGETTI COLLEGATI', payload: 'oggetti-collegati'})
    }
    if (data.entities) {
      navigation.items.push({ text: 'ENTITÀ COLLEGATE', payload: 'entita-collegate'})
    }
    if (data.extraTabUrl) {
      navigation.items.push({ text: 'MAXXI', payload: 'maxxi'})
    }
    if (data.wikiTabUrl) {
      navigation.items.push({ text: 'WIKIPEDIA', payload: 'wiki'})
    }
    return navigation
  }
}