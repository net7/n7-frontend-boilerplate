import { DataSource } from '@n7-frontend/core';

export class AwSearchLayoutTabsDS extends DataSource {
  private selected: string = 'list';

  protected transform(data){
    return { 
      items: [{
        text: 'LISTA', 
        payload: 'list',
        classes: this.selected === 'list' ? 'is-selected' : ''
      }, {
        text: 'GRAFICO', 
        payload: 'chart',
        classes: this.selected === 'chart' ? 'is-selected' : ''
      }, {
        text: 'TIMELINE', 
        payload: 'timeline',
        classes: this.selected === 'timeline' ? 'is-selected' : ''
      }] 
    }
  }

  public setSelected(tabId){
    this.selected = tabId;
  }

}