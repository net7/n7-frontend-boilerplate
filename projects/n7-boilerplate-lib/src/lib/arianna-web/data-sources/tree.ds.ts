import { DataSource } from '@n7-frontend/core';

export class AwTreeDS extends DataSource {

  toggleNav() {
    
  }

  protected transform(data) {     
    return data;
  }

  updateTree(data, parents){
    if ( !data ) {
      data = this.output;    
    }

    data.items.forEach( (it) => {
        if( parents.indexOf( it['_meta'] ) >= 0 ) {
            it['classes'] = "is-expanded";
        }
        if( typeof it['items'] != "undefined" && it['items'].length > 0 ) {            
          this.updateTree(it, parents);            
        }
    });
    this.update(data);
  }

  selectTreeItem(id, data){
    if ( !data ) {
      data = this.output;    
    }

    data.items.forEach( (it) => {
        if(  it['_meta'] == id ) {
            it['classes'] = "is-active";
        } else {
          let classes = it['classes'];
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