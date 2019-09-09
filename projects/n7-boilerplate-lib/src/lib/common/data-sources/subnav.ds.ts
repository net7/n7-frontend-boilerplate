import { DataSource } from '@n7-frontend/core';

export class SubnavDS extends DataSource {

  protected transform(data) {
    return {
      classes: 'main-subnav',
      items: data
    }
  }

  setActive(id){
    this.output.items.forEach(item => {
      if(item._meta.id === id){
        item.classes = 'is-current';
        item._meta.isActive = true;
      } else {
        item.classes = '';
        item._meta.isActive = false;
      }
    });
  }

  getActive(){
    return this.output.items.filter(item => item._meta.isActive)[0] || null;
  }
}
