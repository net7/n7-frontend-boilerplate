import { LayoutDataSource } from '@n7-frontend/core';

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  public test: string;
  
  onInit({ communication, mainState }){
    this.communication = communication;
    this.mainState = mainState;

    this.communication.request$('getTestHero', {
      onError: (error) => console.log(error),
      params: { title: 'quello che vuoi tu!!!' },
      // method: 'GET',
      // httpOptions: {}
    }).subscribe((response) => {
      this.one('aw-hero').update(response);
      //this.one('aw-home-hero-patrimonio').update(response);
      // this.some(['aw-hero']).update(response);
    });


    this.communication.request$('initialGlobalFilterCall', {
      onError: (error) => console.log(error),
    }).subscribe((response) => {
      this.renderBubblesFromApolloQuery(response);
    });

    // update streams
    this.mainState.update('headTitle', 'Arianna Web > Home');
    this.mainState.update('pageTitle', 'Arianna Web: Home Layout');
    this.mainState.update('subnav', this._getSubnav());
    this.mainState.update('breadcrumbs', this._getBreadcrumbs());
  }

  renderBubblesFromApolloQuery(response: any){
    console.log( {response} );
    if( !response || !response.entitiesData ) return;
    let allBubbles = [];
    for(var i=0;i<response.entitiesData.length;i++){
      let currentToE = response.entitiesData[i];
      console.log({currentToE});
      for(var j=0;j<currentToE.entitiesCountData.length;j++){
        allBubbles.push(
          {
            ...currentToE.entitiesCountData[j],
            color:currentToE.countData.type.color
          });
      }
    }
    this.one('aw-home-bubble-chart').update(allBubbles);
  }

  changeTestText(value){
    this.test = value;
  }

  facetsList =
    [
      {
        "countData": {
          "type": {
            "id": "toe-people",
            "label": "Persone",
            "icon": "n7-icon-biography",
            "color": "#3a81f2"
          },
          "count": 36686
        }
      },
      {
        "countData": {
          "type": {
            "id": "toe-places",
            "label": "Luoghi",
            "icon": "n7-icon-map1",
            "color": "#f2cd3a"
          },
          "count": 21996
        }
      },
      {
        "countData": {
          "type": {
            "id": "toe-concepts",
            "label": "Concetti",
            "icon": "n7-icon-lightbulb",
            "color": "#5eab7b"
          },
          "count": 28728
        }
      },
      {
        "countData": {
          "type": {
            "id": "toe-organizations",
            "label": "Organizzazioni",
            "icon": "n7-icon-building",
            "color": "#c48731"
          },
          "count": 41168
        }
      }
    ];

  private _getSubnav(){
    return ['home', 'results', 'single'].map(page => ({
      text: page.toUpperCase(), 
      payload: {
        source: 'navigate',
        handler: 'router',
        path: [`aw/${page}`],
        id: page
      },
      _meta: { id: page }
    }));
  }

  private _getBreadcrumbs(){
    return {
      items: [{
        label: 'Arianna Web',
        payload: {
          source: 'navigate',
          handler: 'router',
          path: [`aw/home`]
        }
      },
      {
        label: 'Home Layout',
        payload: {
          source: 'navigate',
          handler: 'router',
          path: [`aw/home`]
        }
      }] 
    };
  }
}