import { DataSource } from '@n7-frontend/core';

export class AwTreeDS extends DataSource {

  public currentItem: string;

  toggleNav() {

  }

  protected transform(data) {
    return data;
  }

  updateTree(data, parents, id){
    if ( !data ) {
      data = this.output;
    }

    data.items.forEach( (it) => {
      const classes = it['classes'];
      if( it['_meta'] == id ) {
        if ( classes.indexOf("is-expanded") > -1 ) {
          it['classes'] = classes.replace(/is-expanded/g, "is-collapsed");
          if ( it['toggle'] ){
            it['toggle']['icon'] = 'n7-icon-angle-right';
          }
        } else {
          it['classes'] = classes.replace(/is-collapsed/g, "is-expanded");
          if ( it['toggle'] ){
            it['toggle']['icon'] = 'n7-icon-angle-down';
          }
        }
      } else if ( parents.indexOf( it['_meta'] ) >= 0 ) {
          it['classes'] = classes + ' is-expanded';
      }
      if( typeof it['items'] != "undefined" && it['items'].length > 0 ) {
        this.updateTree(it, parents, id);
      }
    });
    this.update(data);
  }

  selectTreeItem(id, data){
    if ( !data ) {
      data = this.output;
    }

    data.items.forEach( (it) => {
        if ( it['_meta'] == id && it['classes'].indexOf('is-active') < 0 ) {
            it['classes'] = it['classes'] + ' is-active';
            this.currentItem = it;
        } else {
          const classes = it['classes'];
          it['classes'] = classes.replace("is-active", "");
        }
        if( typeof it['items'] != "undefined" && it['items'].length > 0 ) {
          this.selectTreeItem(id, it);
        }
    });
    this.update(data);
  }

  toggleSidebar() {
    let sidebarData = this.output;
    if ( sidebarData.classes == "is-expanded" ) {
      sidebarData.classes = "is-collapsed";
    } else {
        sidebarData.classes = "is-expanded";
    }
    this.update(sidebarData);
  }
}