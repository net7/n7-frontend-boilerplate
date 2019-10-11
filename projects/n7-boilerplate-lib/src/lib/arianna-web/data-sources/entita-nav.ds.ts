import { DataSource } from '@n7-frontend/core';

export class AwEntitaNavDS extends DataSource {

  protected transform( param ){
    if (!param) return;

    const data = param.data
    const selected = param.selected
    const navigation = { items: [], payload: 'entita-nav' }

    navigation.items.push({ 
      text: 'OVERVIEW', 
      payload: 'overview', 
      classes: selected == 'overview' ? 'is-selected' : ''
    })
    if (data.fieldsTab) {
      navigation.items.push({
        text: 'CAMPI',
        payload: 'campi',
        classes: selected == 'campi' ? 'is-selected' : ''
      })
    }
    if (data.items) {
      navigation.items.push({
        text: 'OGGETTI-COLLEGATI',
        payload: 'oggetti-collegati',
        classes: selected == 'oggetti-collegati' ? 'is-selected' : ''
      })    }
    if (data.entities) {
      navigation.items.push({
        text: 'ENTITÀ COLLEGATE',
        payload: 'entita-collegate',
        classes: selected == 'entita-collegate' ? 'is-selected' : ''
      })    }
    if (data.extraTab) {
      navigation.items.push({
        text: 'MAXXI',
        payload: 'maxxi',
        classes: selected == 'maxxi' ? 'is-selected' : ''
      })    }
    if (data.wikiTab) {
      navigation.items.push({
        text: 'WIKIPEDIA',
        payload: 'wiki',
        classes: selected == 'wiki' ? 'is-selected' : ''
      })    }
    return navigation
  }
}