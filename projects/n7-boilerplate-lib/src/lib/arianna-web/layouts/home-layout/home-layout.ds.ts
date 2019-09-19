import { LayoutDataSource } from '@n7-frontend/core';

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  public test: string;
  private facetData: any[] = null;
  private allBubbles: any[] = null;
  private updateBubblesFunc: any = null;
  onInit({ communication, mainState }){
    this.communication = communication;
    this.mainState = mainState;

    this.one('aw-hero').update({});

    this.communication.request$('initialGlobalFilterCall', {
      onError: (error) => console.log(error),
    }).subscribe((response) => {
      this.facetData = [];
      response.entitiesData.forEach( (ent) => {
        this.facetData.push({...(ent.countData), enabled:true});
      } );
      this.one('aw-home-facets-wrapper').update(this.facetData);
      this.renderBubblesFromApolloQuery(response);
    });

    // update streams
    this.mainState.update('headTitle', 'Arianna Web > Home');
    this.mainState.update('pageTitle', 'Arianna Web: Home Layout');
    // this.mainState.update('subnav', this._getSubnav());
    // this.mainState.update('breadcrumbs', this._getBreadcrumbs());
  }

  setUpdateBubbles(updateFunc){
    this.updateBubblesFunc = updateFunc;
  }

  renderBubblesFromApolloQuery(response: any){
    if( !response || !response.entitiesData ) return;
    this.allBubbles = [];
    for(var i=0;i<response.entitiesData.length;i++){
      let currentToE = response.entitiesData[i];
      for(var j=0;j<currentToE.entitiesCountData.length;j++){
        this.allBubbles.push(
          {
            ...currentToE.entitiesCountData[j],
            color:currentToE.countData.type.color
          });
      }
    }
    this.one('aw-home-bubble-chart').update({bubbles:this.allBubbles,setUpdateReference:this.setUpdateBubbles});
  }

  toggleFacetEnabled(facetId){
    this.facetData.forEach( (f) => {
        if(f.type.id===facetId){
          f.enabled = !f.enabled;
        }
    });
    this.one('aw-home-facets-wrapper').update(this.facetData);
    let currentBubbles = this.allBubbles.filter(
      (bubble) => {
        for(var i=0; i<this.facetData.length; i++){
          if( bubble.entity.typeOfEntity.id === this.facetData[i].type.id )
            if( !this.facetData[i].enabled ){ return false; }
        }
        return true;
      }
    );
    console.log('number of bubbles ' , currentBubbles.length );
    this.one('aw-home-bubble-chart').update({bubbles:currentBubbles});
    if(this.updateBubblesFunc) this.updateBubblesFunc();
  }

  changeTestText(value){
    this.test = value;
  }
  
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