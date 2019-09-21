import { DataSource } from '@n7-frontend/core';

export class AwTreeDS extends DataSource {

  toggleNav() {
    
  }

  protected transform(data) {
    let tree = [];
    let treeObj = {
      items: []
    };


    data['branches'].forEach( item => {
            treeObj['items'].push( this.parseTree(item, true) );
          })

    return treeObj;
    //return treeObj;
    /*data.forEach(function (item, key) {
      if( key != "branches" ) {
        treeObj[key] = item;
      }
      else {
        
      }
      console.log(key); // the key (ex. sandwich)
      console.log(item); // the item (ex. turkey)
    });*/

    const SIDEBAR_HEADER_DATA = {
       
  items: [
    {
      text: 'Collezione d\'arte',
      payload: 'collezione arte',
      classes: 'is-collapsed',
    },
    {
      text: 'Centro archivi',
      payload: 'centro archivi',
      classes: 'is-collapsed',
        items: [
        {
          toggle: {
            icon: 'n7-icon-angle-right',
            payload: 'toggle'
          }, 
          text: '5+1AA Agenzia di Architettura',
          payload: 'prova'
        },
        {
          toggle: {
            icon: 'n7-icon-angle-down',
            payload: 'toggle'
          }, 
          text: 'ABDR Architetti Associati',
          payload: '',
          items: [
            {
              toggle: {
                icon: 'n7-icon-angle-down',
                payload: 'toggle'
              }, 
              text: '5+1AA Agenzia di Architettura',
              classes: 'is-expanded',
              payload: '',
              items: [
                {
                  toggle: {
                    icon: 'n7-icon-angle-right',
                    payload: 'toggle'
                  }, 
                  text: '5+1AA Agenzia di Architettura',
                  classes: 'is-collapsed',
                  payload: ''
                },
                {
                  toggle: {
                    icon: 'n7-icon-angle-down',
                    payload: 'toggle'
                  }, 
                  text: 'ABDR Architetti Associati',
                  classes: 'is-expanded',
                  payload: '',
                  items: [
                    {
                      toggle: {
                        icon: 'n7-icon-angle-down',
                        payload: 'toggle'
                      }, 
                      text: '5+1AA Agenzia di Architettura',
                      classes: 'is-expanded',
                      payload: '',
                      items: [
                        {
                          toggle: {
                            icon: 'n7-icon-angle-right',
                            payload: 'toggle'
                          }, 
                          text: '5+1AA Agenzia di Architettura',
                          classes: 'is-collapsed',
                          payload: ''
                        },
                        {
                          toggle: {
                            icon: 'n7-icon-angle-right',
                            payload: 'toggle'
                          }, 
                          text: 'ABDR Architetti Associati',
                          classes: 'is-collapsed',
                          payload: ''
                        },
                      ]
                    },
                    {
                      toggle: {
                        icon: 'n7-icon-angle-right',
                        payload: 'toggle'
                      }, 
                      text: 'ABDR Architetti Associati',
                      classes: 'is-collapsed',
                      payload: ''
                    },
                  ]
                },
              ]
            },
            {
              toggle: {
                icon: 'n7-icon-angle-right',
                payload: 'toggle'
              }, 
              text: 'ABDR Architetti Associati',
              classes: 'is-collapsed',
              payload: ''
            },
          ]
        },
        {
          toggle: {
            icon: 'n7-icon-angle-right',
            payload: 'toggle'
          }, 
          text: 'AWP',
          classes: 'is-collapsed',
          payload: ''
        },
        {
          toggle: {
            icon: 'n7-icon-angle-right',
            payload: 'toggle'
          }, 
          text: 'BOERI Cini',
          classes: 'is-collapsed',
          payload: ''
        },
        {
          toggle: {
            icon: 'n7-icon-angle-right',
            payload: 'toggle'
          }, 
          text: 'CAMPO BAEZA Alberto',
          classes: 'is-collapsed',
          payload: ''
        },
        {
          toggle: {
            icon: 'n7-icon-angle-right',
            payload: 'toggle'
          }, 
          text: 'CASSANI Matilde',
          classes: 'is-collapsed',
          payload: ''
        },
        {
          toggle: {
            icon: 'n7-icon-angle-right',
            payload: 'toggle'
          }, 
          text: 'GUERRI Danilo',
          classes: 'is-collapsed',
          payload: ''
        },
        {
          toggle: {
            icon: 'n7-icon-angle-right',
            payload: 'toggle'
          }, 
          text: 'ISOLA Aimaro',
          classes: 'is-collapsed',
          payload: ''
        },
        {
          toggle: {
            icon: 'n7-icon-angle-down',
            payload: 'toggle'
          },
          text: 'NERVI Pier Luigi',
          classes: 'is-expanded',
          payload: ''
        },
        {
          toggle: {
            icon: 'n7-icon-angle-down',
            payload: 'toggle'
          },
          text: 'Attività Professionale',
          classes: 'is-expanded',
          payload: '',
          items:[
            {
              icon: 'n7-icon-file3',
              text: 'Cinema teatro Augusteo e stazione centrale della funicolare, Napoli ([1926] - [1927])',
              payload: '',
            },
            {
              classes: 'is-active',
              icon: 'n7-icon-file3',
              text: 'Stadio comunale G.Berta, Firenze ([1929] - [1932])',
              payload: '',
            },
            {
              icon: 'n7-icon-file3',
              text: 'Monumento alla Bandiera, Roma (1931)',
              payload: '',
            },
            {
              img: 'http://placeimg.com/25/25/arch/grayscale',
              text: 'Brevetto hangar circolare con piattaforma anulare rotante (1932)',
              payload: '',
            },
            {
              img: 'http://placeimg.com/25/25/arch/grayscale',
              text: 'Stadio da 120.000 posti, Roma ([1933])',
              payload: '',
              classes: 'is-active'
            },
            {
              icon: 'n7-icon-file3',
              text: 'Magazzino ([1934])',
              payload: '',
              classes: 'is-active',
            },
            {
              icon: 'n7-icon-file3',
              text: 'Aviorimesse, Orvieto (TR), Orbetello (GR), Torre del Lago (LU), Marsala (TP), Trapani ([1935] - 1941)',
              payload: '',
            },
          ]
        },
      ]
    },
  ]
    };
    return SIDEBAR_HEADER_DATA;
  }

  private parseTree(data, toggle) {
    let treeItem = {};
    Object.keys(data).forEach( key => {
      if( toggle ){
        treeItem['toggle'] = {
          icon: 'n7-icon-angle-right',
          payload: 'toggle'
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
            case "id" : treeItem['payload'] = data[key]; break;
            default :  data[key]; break;
          }

          treeItem['classes'] = 'is-expanded';
        }
        else if( data['branches'] != null ) {
          treeItem['items'] = [];
          data[key].forEach( item => {
            treeItem['items'].push( this.parseTree(item, true) );
          })
        }        
        //this.set(key, this.config.global[key]);
      }
    )
    return treeItem;
  }
}