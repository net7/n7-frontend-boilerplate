import { LayoutDataSource } from '@n7-frontend/core';

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
  public tree: any;

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

    this.one('aw-patrimonio-sidebar-header').update(null);    
    
    //this.one('aw-tree').update(null);

    this.communication.request$('getTree', {
      onError: (error) => console.log(error),
      params: { treeId: "patrimonioId" },
      // method: 'GET',
      // httpOptions: {}
    }).subscribe((response) => {
        let treeObj = {
            items: []
          };
        response['branches'].forEach( item => {
          treeObj['items'].push( this.parseTree(item, false, []) );
        })

      let header = {
        iconLeft: 'n7-icon-tree-icon',
         text:  response['label'],
         iconRight: 'n7-icon-angle-left',
         classes: 'is-expanded',
         payload: 'header'
     };

      this.one('aw-tree').update(treeObj);
      this.one('aw-sidebar-header').update(header);
    });
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
                treeItem['_meta'] = data[key];               
                break;
            default :  data[key]; break;
          }
          treeItem['classes'] = 'is-collapsed';
        }
        else if( data['branches'] != null ) {
          currParents.push(data['id']);
          treeItem['items'] = [];          
          data[key].forEach( item => {
            treeItem['items'].push( this.parseTree(item, true, currParents) );
          })
        }        
        //this.set(key, this.config.global[key]);
      }
    )
    return treeItem;
  }

}