import { LayoutDataSource } from '@n7-frontend/core';
import { Observable, fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';
const config:any = require('src/assets/app-config.json');

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  public test: string;
  private facetData: any[] = null;
  private facetInputs: any = {};
  private allBubbles: any[] = null;
  public selectedBubbles: any[] = [];
  public numOfItemsStr: string = null;
  private _bubbleChart: any = null;
  private maxBubblesSelectable:number = 3;
  private entityBubbleIdMap: any = {};

  onInit({ communication, mainState }){
    this.communication = communication;
    this.mainState = mainState;

    this.one('aw-hero').update({});

    this.communication.request$('globalFilter', {
      onError: (error) => console.error(error),
    }).subscribe((response) => {
      this.facetData = [];
      response.entitiesData.forEach( (ent) => {
        const teoConfigData = config["config-keys"][ent.countData.type.configKey];
        if(teoConfigData)
          this.facetData.push({...(ent.countData),
                              enabled:true,
                              icon: teoConfigData.icon,
                              label: teoConfigData.label
                              });
      } );
      this.one('aw-home-facets-wrapper').update(this.facetData);
      this.setAllBubblesFromApolloQuery(response);
      this.renderPreviewsFromApolloQuery(response);
    });

    // update streams
    this.mainState.update('headTitle', 'Arianna Web > Home');
    this.mainState.update('pageTitle', 'Arianna Web: Home Layout');

    fromEvent( window , "resize" ).pipe(debounce(() => interval(200))).
    subscribe( (response) => {
      this.updateBubblesAndItemPreviews(true);
    });
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
          this.updateBubblesAndItemPreviews();
        }
      }
    }
  }

  public onBubbleDeselected(payload){
    if(payload && payload.bubble){
      this.selectedBubbles = this.selectedBubbles.filter(
        (b) => b.id!==payload.bubble.id );
      if(payload.bubble.hasCloseIcon){
        payload.bubble.hasCloseIcon=false;
        this.updateBubblesAndItemPreviews();
      }
    }
  }

  private updateBubblesAndItemPreviews(onlyBubbles?:boolean){
    let selectedEntitiesIds = [];
    if(this.entityBubbleIdMap)
    this.selectedBubbles.forEach( (sB) => {
      let entityId = this.entityBubbleIdMap[sB.id];
      if(entityId)
        selectedEntitiesIds.push(entityId);
    });
    this.communication.request$('globalFilter', {
      onError: (error) => console.error(error),
      params: { 
        selectedEntitiesIds,
        itemsPagination:{ offset:0,limit:4 }
      },
    }).subscribe((response) => {
      if(!onlyBubbles){
        this.renderPreviewsFromApolloQuery(response);
        this.renderItemTags();
      }
      this.setAllBubblesFromApolloQuery(response,true);
    });
  }

  setAllBubblesFromApolloQuery(response: any,reset?:boolean){
    if( !response || !response.entitiesData ) return;
    this.allBubbles = [];
    for(var i=0;i<response.entitiesData.length;i++){
      let currentToE = response.entitiesData[i];
      for(var j=0;j<currentToE.entitiesCountData.length;j++){
        this.allBubbles.push(
          {
            ...currentToE.entitiesCountData[j],
            color: config["config-keys"][currentToE.countData.type.configKey]['color']['hex']
          });
      }
    }
    this.entityBubbleIdMap = {};
    this.allBubbles.forEach( (bubble) => {
      // d3/svg does not allow Number as beginning of ID.
      // d3/svg does not allow '-' as part of ID.
      bubble.id = 'B_'+bubble.entity.id.replace(/-/g,'_');
      this.entityBubbleIdMap[bubble.id]=bubble.entity.id;
      return bubble;
    });
    this.allBubbles.forEach( (bubble) => {
      bubble.selected = false;
      for(var i=0; i<this.selectedBubbles.length;i++){
        if(this.selectedBubbles[i].id===bubble.id) bubble.selected=true;
      }
    });
    this.one('aw-home-bubble-chart').update({
      width: window.innerWidth/1.8,
      bubbles: this.filterBubblesBasedOnFacetsEnabled(),
      reset: ( reset? reset : false ),
      setBubbleChart: (bubbleCref) => this._bubbleChart = bubbleCref
    });
  }

  filterBubblesBasedOnFacetsEnabled(){
    let result = this.allBubbles.filter(
      (bubble) => {
        for(var i=0; i<this.facetData.length; i++){
          if( bubble.entity.typeOfEntity.id === this.facetData[i].type.id )
            if( !this.facetData[i].enabled ){ return false; }
        }
        return true;
      }
    );
    return result;
  }

  handleFacetSearchChange(change) {
    var payload: string = change.inputPayload;
    var value: string = change.value;
    // store the entered text in facetInputs
    this.facetInputs[payload] = value;
  }

  handleFacetSearchEnter(enter) {
    var payload: string = enter.inputPayload;
    // get the text entered in this input
    var value: string = this.facetInputs[payload];
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
            if(this.allBubbles[i].id===bubble.id){
              typeOfEntity=this.allBubbles[i].entity.typeOfEntity.id;
              break;
            }
          }
          if(disableFacetsIds.includes(typeOfEntity)) return false;
          return true;
        });
        if(filteredSelectedBubbles.length!=this.selectedBubbles.length){
          this.selectedBubbles = filteredSelectedBubbles;
        };
      }
      this.allBubbles.forEach( (bubble) => {
        bubble.selected = false;
        for(var i=0; i<this.selectedBubbles.length;i++){
          if(this.selectedBubbles[i].id===bubble.id) bubble.selected=true;
        }
      });
      this.one('aw-home-bubble-chart').update({
        width: window.innerWidth/1.8,
        bubbles:this.filterBubblesBasedOnFacetsEnabled(),
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
        if(this.allBubbles[i].id===sBubble.id){
          label = this.allBubbles[i].entity.label;
          break;
        }
      }
      tagsData.push({label,icon:"n7-icon-close",payload:sBubble.id,classes:"tag-"+this.allBubbles[i].entity.typeOfEntity.id});
    });
    this.one('aw-home-item-tags-wrapper').update(tagsData);
  }

  onTagClicked(payload){
    if(!payload) return;
    const bubbleId=payload;
    if(this._bubbleChart){
      this._bubbleChart.selectAll(`g`).each( b => {
        if(b.id===bubbleId) b.hasCloseIcon = false;
      });
    }
    this.selectedBubbles = this.selectedBubbles.filter( (b) => b.id!==payload );
    this.updateBubblesAndItemPreviews();
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