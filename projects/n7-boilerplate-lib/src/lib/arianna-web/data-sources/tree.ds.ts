import { DataSource } from '@n7-frontend/core';

export class AwTreeDS extends DataSource {

  public currentItem: string;
  public icons: any;

  protected transform(data) {
    this.icons = this.options.icons
    return data;
  }

  updateTree(data, parents, id){
    if ( !data ) {
      data = this.output;
    }
    data.items.forEach( (it) => {
      const classes = it['classes'];
      if( it['_meta'] == id ) {
        if ( classes && classes.indexOf('is-expanded') > -1 ) {
          it['classes'] = classes.replace(/is-expanded/g, 'is-collapsed');
          if ( it['toggle'] ){
            it['toggle']['icon'] = 'n7-icon-angle-right';
          }
        } else {
          it['classes'] = classes.replace(/is-collapsed/g, 'is-expanded');
          if ( it['toggle'] ){
            it['toggle']['icon'] = 'n7-icon-angle-down';
          }
        }
      } else if ( parents && parents.indexOf( it['_meta'] ) >= 0 ) {
          it['classes'] = classes + ' is-expanded';
      }
      if( typeof it['items'] != 'undefined' && it['items'].length > 0 ) {
        this.updateTree(it, parents, id);
      }
    });
    this.update(data);
  }

  selectTreeItem(id, data){
    if ( !data ) {
      data = this.output;
    }

    if( this.currentItem && this.currentItem["_meta"] == id ){
      return;
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

  public parseData(data) {
    let treeObj = {
      items: []
    };
    if( data['branches']) {
      data['branches'].forEach( item => {
        treeObj['items'].push( this.parseTree(item, false, []) );
      });
    }
    this.update(treeObj);
  }

  private parseTree(data, toggle, parents) {
    var currParents = [...parents];
    let treeItem = {};
    const showToggle =  toggle && data['branches'] != null;
    if( showToggle ){
      treeItem['toggle'] = {
        icon: 'n7-icon-angle-right',
        payload: {
            source: "toggle",
            id: data['id'],
            parents: currParents,
          }
      }
    }
    Object.keys(data).forEach( key => {
    if( key != "branches" ) {
      switch (key) {
        case "label": treeItem['text'] = data[key]; break;
        case "img" : treeItem['img'] = data[key]; break;
        case "icon" :
            if (showToggle && data[key] != null){
              treeItem['toggle']['icon'] = data[key];
            } else {
              treeItem['icon'] = data[key];
            }
            break;
        case "id" :
            treeItem['_meta'] =  data[key];
            treeItem['payload'] = {
              source: "menuItem",
              id: data['id']
            };
            break;
        default :  data[key]; break;
      }
      treeItem['classes'] = 'is-collapsed';
    }
    else if( data['branches'] != null ) {
      currParents.push(data['id']);

      /*Handle cases with menu item with children but without toggle*/
      if( !toggle ) {
        treeItem['payload']['source'] = "ToggleMenuItem";
        treeItem['payload']['parents'] = currParents;
      }

      treeItem['items'] = [];
      data[key].forEach( item => {
        if ( item['img'] != "" ) {
          treeItem['iconright'] = "n7-icon-images";
        }

        treeItem['items'].push( this.parseTree(item, true, currParents) );
      })
    }
    })
    return treeItem;
  }

}