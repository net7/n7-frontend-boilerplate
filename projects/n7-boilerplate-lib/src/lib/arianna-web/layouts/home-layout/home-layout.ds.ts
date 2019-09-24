import { LayoutDataSource } from '@n7-frontend/core';

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  public test: string;
  private facetData: any[] = null;
  private facetInputs: any = {};
  private allBubbles: any[] = null;
  public selectedBubbles: any[] = [];
  public numOfItemsStr: string = null;
  public _updateBubbles: any = null;
  private _bubbleChart: any = null;
  private maxBubblesSelectable:number = 3;

  onInit({ communication, mainState }){
    this.communication = communication;
    this.mainState = mainState;

    this.one('aw-hero').update({});

    this.communication.request$('globalFilter', {
      onError: (error) => console.log(error),
    }).subscribe((response) => {
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
      let numOfItemsTmpStr = numOfItems + '';
      if(numOfItems<10) numOfItemsTmpStr = '00'+numOfItems;
      else if(numOfItems<100) numOfItemsTmpStr = '0'+numOfItems;
      if(numOfThousand>0)
        this.numOfItemsStr = numOfThousand+'.'+numOfItemsTmpStr;
      else
       this.numOfItemsStr = numOfItems+'';
    } else {
      this.numOfItemsStr = null;
    }

    this.one('aw-home-item-preview-wrapper').update(response.itemsPagination.items);
  }

  public onBubbleSelected(payload){
    if(payload && payload.bubble){
      if(!this.selectedBubbles.includes(payload.bubble)){
        if(this.selectedBubbles.length<this.maxBubblesSelectable){
          this.selectedBubbles.push(payload.bubble);
          payload.bubble.hasCloseIcon=true;
          if(this._updateBubbles) this._updateBubbles();
          this.updateItemPreviews();
        }
      }
    }
  }


  public onBubbleDeselected(payload){
    if(payload && payload.bubble){
      console.log({bubbbllle:payload.bubble});
      this.selectedBubbles = this.selectedBubbles.filter(
        (b) => b.id!==payload.bubble.id );
      console.log({selectedBubbles:this.selectedBubbles});
      if(payload.bubble.hasCloseIcon){
        payload.bubble.hasCloseIcon=false;
        if(this._updateBubbles) this._updateBubbles();
        this.updateItemPreviews();
      }
    }
  }

  private updateItemPreviews(){
    let selectedEntitiesIds = [];
    this.selectedBubbles.forEach( (sB) => {
      selectedEntitiesIds.push(sB.id);
    });
    console.log({selectedEntitiesIds});
    this.communication.request$('globalFilter', {
      onError: (error) => console.log(error),
      params: { selectedEntitiesIds,
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
      if(this._updateBubbles) this._updateBubbles();
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
      bubbles:this.allBubbles,
      setUpdateReference: (ref) => this._updateBubbles = ref,
      setBubbleChart: (bubbleCref) => this._bubbleChart = bubbleCref
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
        let filteredSelectedBubbles = this.selectedBubbles.filter( (bubble) => {
          let typeOfEntity = "";
          for(var i=0;i<this.allBubbles.length;i++){
            if(this.allBubbles[i].entity.id===bubble.id){
              typeOfEntity=this.allBubbles[i].entity.typeOfEntity.id;
              break;
            }
          }
          if(disableFacetsIds.includes(typeOfEntity)) return false;
          return true;
        });
        if(filteredSelectedBubbles.length!=this.selectedBubbles.length){
          this.selectedBubbles = filteredSelectedBubbles;
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
        for(var i=0; i<this.selectedBubbles.length;i++){
          if(this.selectedBubbles[i].id===bubble.entity.id) bubble.selected=true;
        }
      });
      this.one('aw-home-bubble-chart').update({
        width: window.innerWidth/1.8,
        bubbles:currentBubbles,
        setBubbleChart: (bubbleCref) => this._bubbleChart = bubbleCref,
        reset:true
      });
    }
  }

  renderItemTags(){
    let tagsData = [];
    this.selectedBubbles.forEach( (sBubble) => {
      let label = '';
      for(var i=0;i<this.allBubbles.length;i++){
        if(this.allBubbles[i].entity.id===sBubble.id){
          label = this.allBubbles[i].entity.label;
          break;
        }
      }
      tagsData.push({label,icon:"n7-icon-close",payload:sBubble.id});
    });
    this.one('aw-home-item-tags-wrapper').update(tagsData);
  }


  onTagClicked(payload){
    if(!payload) return;
    const bubbleId=payload;
    this.selectedBubbles.forEach( (sB) => {
      if(sB.id===bubbleId) sB.hasCloseIcon=false;
    });
    if(this._bubbleChart){
      this._bubbleChart.selectAll(`g`).each( b => {
        if(b.id===bubbleId) b.hasCloseIcon = false;
      });
    }
    if(this._updateBubbles) this._updateBubbles();
    this.selectedBubbles = this.selectedBubbles.filter( (b) => b.id!==payload );
    this.updateItemPreviews();
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