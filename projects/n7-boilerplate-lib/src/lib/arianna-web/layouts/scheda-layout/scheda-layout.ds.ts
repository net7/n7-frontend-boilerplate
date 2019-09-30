import { LayoutDataSource } from '@n7-frontend/core';
import { ItemPreviewComponent } from '@n7-frontend/components';
import { Location } from '@angular/common';

export class AwPatrimonioLayoutDS extends LayoutDataSource {
  /**
  * If you are not using these variables (from your-layout.ts), 
  * remove them from here too.
  */
  private communication: any;
  protected configuration: any;
  protected mainState: any;
  protected router: any;
  protected titleService: any;

  public options: any;
  public pageTitle: string;
  public hasBreadcrumb: boolean;
  public contentParts: any;
  public tree: any;
  public sidebarCollapsed: boolean;
  /**
  * If you are not using these variables (from your-layout.ts), 
  * remove them from onInit() parameters and inside the function.
  */
  onInit({configuration, mainState, router, options, titleService, communication }) {
    this.configuration = configuration;
    this.mainState = mainState;
    this.router = router;
    this.titleService = titleService;
    this.communication = communication;
    this.options = options; 
    this.sidebarCollapsed = false;
  }

  getNavigation( id ) {
    return this.communication.request$('getTree', {
      onError: (error) => console.error(error),
      params: { treeId: id }
    })
  }

  updateNavigation( data ) {
    let treeObj = {
      items: []
    };

    data['branches'].forEach( item => {
      treeObj['items'].push( this.parseTree(item, false, []) );
    })

    let header = {
      iconLeft: 'n7-icon-tree-icon',
      text:  data['label'],
      iconRight: 'n7-icon-angle-left',
      classes: 'is-expanded',
      payload: 'header'
    };

    this.one('aw-tree').update(treeObj);
    this.one('aw-sidebar-header').update(header);
    this.one('aw-scheda-breadcrumbs').update(null);
  }

  loadItem(id){
    if(id) {
      return  this.communication.request$('getItemDetails', {
        onError: (error) => console.error(error),
        params: { itemId: id }
      })
    } else {
      /* TODO: valori statici, da prendere da config */
      this.pageTitle = 'Collezione d\'Arte';
      this.hasBreadcrumb = false;
      this.contentParts = [
        {
          type: "text",
          title: 'Collezione d\'Arte',
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi gravida sagittis pulvinar. Etiam iaculis maximus metus, id tincidunt libero auctor et. Proin tempus turpis vel erat ultrices, id vestibulum ante cursus. Vestibulum lobortis, ante at eleifend consequat, massa libero bibendum justo, id fermentum magna odio ac nulla. Cras aliquet scelerisque malesuada. Mauris congue fermentum tristique. Nulla imperdiet accumsan dui, tristique lobortis metus eleifend non. Donec quis odio massa. Cras sit amet sem eu turpis molestie blandit vitae sed nibh. Pellentesque ornare enim nisl, et efficitur ante elementum a. Ut nec ex finibus, congue libero feugiat, aliquam ante. Cras sem neque, pellentesque eget mi at, auctor vulputate tellus. Sed aliquam mi a tortor ultricies interdum. Etiam tincidunt nunc commodo nulla porttitor semper. Etiam porta lacinia libero a mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        },
        {
          type: "text",
          title: 'Centro Archivi',
          content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi gravida sagittis pulvinar. Etiam iaculis maximus metus, id tincidunt libero auctor et. Proin tempus turpis vel erat ultrices, id vestibulum ante cursus. Vestibulum lobortis, ante at eleifend consequat, massa libero bibendum justo, id fermentum magna odio ac nulla. Cras aliquet scelerisque malesuada. Mauris congue fermentum tristique. Nulla imperdiet accumsan dui, tristique lobortis metus eleifend non. Donec quis odio massa. Cras sit amet sem eu turpis molestie blandit vitae sed nibh. Pellentesque ornare enim nisl, et efficitur ante elementum a. Ut nec ex finibus, congue libero feugiat, aliquam ante. Cras sem neque, pellentesque eget mi at, auctor vulputate tellus. Sed aliquam mi a tortor ultricies interdum. Etiam tincidunt nunc commodo nulla porttitor semper. Etiam porta lacinia libero a mattis. Lorem ipsum dolor sit amet, consectetur adipiscing elit."
        }
      ]
    }
  }

  loadContent(response) {
    this.hasBreadcrumb = true;
      if(response){
        this.contentParts = [];
        if( response.image ) {
          this.contentParts.push({    
            image: response.image,       
            type: 'image'
          });    
        }

        this.contentParts.push({          
          title: response.title,
          content: response.text,
          type: 'text'
        });
        
        let breadcrumbs = {
          items: []
        }
        
        if(response.fields){
          response.fields.forEach(field => {
            this.contentParts.push({
              title: field.label,
              content: response.text,
              type: 'metaGroup',
              fields: field.fields
            })
          });
        }


        response.breadcrumbs.forEach(element => {
          breadcrumbs.items.push({
            label: element.label,
            payload: element.link
          })
        });
        this.one('aw-scheda-breadcrumbs').update(breadcrumbs);
      }   
  }

  private parseTree(data, toggle, parents) {
    var currParents = [...parents];
    let treeItem = {};
    Object.keys(data).forEach( key => {
      if( toggle ){
        treeItem['toggle'] = {
          icon: 'n7-icon-angle-right',
          payload: {
              source: "toggle",
              id: data['id'],
              parents: currParents,
            }           
        }
    } 
    
    if( key != "branches" ) {
      switch (key) {
        case "label": treeItem['text'] = data[key]; break;
        case "icon" :  
            if (toggle) 
            {
              treeItem['toggle']['icon'] = data[key];
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
        treeItem['items'].push( this.parseTree(item, true, currParents) );
      })   
    }        
    })
    return treeItem;
  }

  collapseSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

}