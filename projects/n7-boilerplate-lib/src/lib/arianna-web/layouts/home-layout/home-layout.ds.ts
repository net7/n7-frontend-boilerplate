import { LayoutDataSource } from '@n7-frontend/core';

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  public test: string;
  private facetData: any[] = null;
  private facetInputs: any = {};
  private allBubbles: any[] = null;
  public selectedBubbleIds: any[] = [];
  public numOfItemsStr: string = null;

  onInit({ communication, mainState }){
    this.communication = communication;
    this.mainState = mainState;

    this.one('aw-hero').update({});

    this.communication.request$('globalFilter', {
      onError: (error) => console.log(error),
    }).subscribe((response) => {
      console.log('apollo-response', {response})
      this.facetData = [];
      response.entitiesData.forEach( (ent) => {
        this.facetData.push({...(ent.countData), enabled:true});
      } );
      this.one('aw-home-facets-wrapper').update(this.facetData);
      this.renderBubblesFromApolloQuery(response);
      this.renderPreviewsFromApolloQuery(response);
    });

    // update streams
    this.mainState.update('headTitle', 'Arianna Web > Home');
    this.mainState.update('pageTitle', 'Arianna Web: Home Layout');
    // this.mainState.update('subnav', this._getSubnav());
    // this.mainState.update('breadcrumbs', this._getBreadcrumbs());
  }


  renderPreviewsFromApolloQuery(response: any){
    if(!response || !response.itemsPagination) return;

    let numOfItems = response.itemsPagination.totalCount;
    if(numOfItems>0){
      let numOfThousand = 0;
      while(numOfItems>999){
        numOfItems-=1000;
        numOfThousand += 1;
      }
      if(numOfThousand>0)
        this.numOfItemsStr = numOfThousand+'.'+numOfItems;
      else
       this.numOfItemsStr = numOfItems+'';
    } else {
      this.numOfItemsStr = null;
    }

    this.one('aw-home-item-preview-wrapper').update(response.itemsPagination.items);
  }

  public onBubbleSelected(payload){
    if(payload && payload.id){
      if( !this.selectedBubbleIds.includes(payload.id))
        this.selectedBubbleIds.push(payload.id);
    }
    this.updateItemPreviews();
  }


  public onBubbleDeselected(payload){
    if(payload && payload.id)
      this.selectedBubbleIds = this.selectedBubbleIds.filter(
        (b) => {
          return (b!==payload.id); }
      );
      this.updateItemPreviews();
  }

  private updateItemPreviews(){
    this.communication.request$('globalFilter', {
      onError: (error) => console.log(error),
      params: { selectedEntitiesIds: this.selectedBubbleIds,
                itemsPagination:{ offset:0,limit:4 } },
    }).subscribe((response) => {
      // the facets should be handled by the layout
      // (otherwise they would always return as enabled)
      //this.facetData = [];
      //response.entitiesData.forEach( (ent) => {
      //  this.facetData.push({...(ent.countData), enabled:true});
      //});
      this.renderPreviewsFromApolloQuery(response);
      this.renderItemTags();
    });
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
    this.allBubbles.map( (bubble) => {
      // d3/svg doesn't allow '-' or strings starting with a number as ids
      bubble.entity.id = 'B_'+bubble.entity.id.replace(/-/g,'_');
      return bubble;
    });
    this.one('aw-home-bubble-chart').update({
      width: window.innerWidth/1.8,
      bubbles:this.allBubbles
    });
  }

  handleFacetSearchChange(change) {
    var payload: string = change.inputPayload;
    var value: string = change.value;
    // store the entered text in facetInputs
    this.facetInputs[payload] = value;
    console.log('changed: '+ payload + ' with value: ' + value)
  }

  handleFacetSearchEnter(enter) {
    var payload: string = enter.inputPayload;
    var value: string = this.facetInputs[payload];
    // get the text entered in this input
    console.log('entered: ' + payload + ' with value: ' + value)
  }

  handleFacetHeaderClick(facetId){
    let updateBubbles = false;
    let enabledFacets = this.facetData.filter( (f) => f.enabled ).length;
    this.facetData.forEach( (f) => {
        if(f.type.id===facetId){
          if(f.enabled){
            if(enabledFacets>1){
              f.enabled = false;
              updateBubbles = true;
            }
          } else {
            f.enabled = true;
            updateBubbles = true;
          }
        }
    });
    this.one('aw-home-facets-wrapper').update(this.facetData);
    if(updateBubbles){
      let disableFacetsIds = [];
      this.facetData.forEach( (fD) => {
        if(!fD.enabled) disableFacetsIds.push(fD.type.id);
      });

      if(disableFacetsIds){
        let filteredSelectedBubbleIds = this.selectedBubbleIds.filter( (bId) => {
          let typeOfEntity = "";
          for(var i=0;i<this.allBubbles.length;i++){
            if(this.allBubbles[i].entity.id===bId){
              typeOfEntity=this.allBubbles[i].entity.typeOfEntity.id;
              break;
            }
          }
          if(disableFacetsIds.includes(typeOfEntity)) return false;
          return true;
        });
        if(filteredSelectedBubbleIds.length!=this.selectedBubbleIds.length){
          this.selectedBubbleIds = filteredSelectedBubbleIds;
          this.updateItemPreviews();
        };
      }
      let currentBubbles = this.allBubbles.filter(
        (bubble) => {
          for(var i=0; i<this.facetData.length; i++){
            if( bubble.entity.typeOfEntity.id === this.facetData[i].type.id )
              if( !this.facetData[i].enabled ){ return false; }
          }
          return true;
        }
      );
      currentBubbles.forEach( (bubble) => {
        bubble.selected = false;
        if(this.selectedBubbleIds.includes(bubble.entity.id)){
          bubble.selected = true;
        }
      });
      this.one('aw-home-bubble-chart').update({
        width: window.innerWidth/1.8,
        bubbles:currentBubbles,
        reset:true
      });
    }
  }

  renderItemTags(){
    let tagsData = [];
    this.selectedBubbleIds.forEach( (sBid) => {
      let label = '';
      for(var i=0;i<this.allBubbles.length;i++){
        if(this.allBubbles[i].entity.id===sBid){
          label = this.allBubbles[i].entity.label;
          break;
        }
      }
      tagsData.push({label});
    });
    this.one('aw-home-item-tags-wrapper').update(tagsData);
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