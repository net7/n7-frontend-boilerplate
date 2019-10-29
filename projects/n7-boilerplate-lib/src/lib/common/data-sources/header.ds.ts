import { DataSource } from '@n7-frontend/core';

export class HeaderDS extends DataSource {
  protected transform(data) {

    if (data.selected) {
      this.selectNavItem(data.selected);
    }

    return data.items;
  }

  public selectNavItem(selectedItem) {
    this.output.nav.items.forEach( item => {
      item.classes = "";
      if ( item.payload == selectedItem ){
        item.classes = "is-current";
      }
    })
    this.update({'items': this.output});
  }
}
