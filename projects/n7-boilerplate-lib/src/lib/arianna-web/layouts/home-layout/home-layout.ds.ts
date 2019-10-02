import { LayoutDataSource } from '@n7-frontend/core';
import { fromEvent, interval } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

const config:any = require('src/assets/app-config.json');

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  private tippy: any;
  private configuration: any;
  private facetData: any[] = null;
  private facetInputs: any = {};
  private allBubbles: any[] = null;
  public selectedBubbles: any[] = [];
  public numOfItemsStr: string = null;
  private _bubbleChart: any = null;
  private maxBubblesSelectable:number = 3;
  private entityBubbleIdMap: any = {};
  private lastWindowWidth: number = -1;
  private bubblePopup: any = null;
  public currentHoverEntity: any = null;
  public hasScrollBackground: boolean = false;

  onInit({ communication, mainState, configuration, tippy }){
    this.communication = communication;
    this.tippy = tippy;
    this.mainState = mainState;
    this.configuration = configuration;

    this.one('aw-hero').update(this.configuration.get('home-layout')['top-hero']);
    this.one('aw-home-hero-patrimonio').update(this.configuration.get('home-layout')['bottom-hero']);

    this.communication.request$('globalFilter', {
      onError: (error) => console.error(error),
    }).subscribe((response) => {
      this.facetData = [];
      response.entitiesData.forEach( (ent) => {
        const teoConfigData = this.configuration.get("config-keys")[ent.countData.type.configKey];
        if(teoConfigData)
          this.facetData.push({
            ...ent.countData,
            ...teoConfigData,                  
            enabled:true,
          });
      } );
      this.one('aw-home-facets-wrapper').update(this.facetData);
      this.setAllBubblesFromApolloQuery(response);
      this.renderPreviewsFromApolloQuery(response);
    });

    // update streams
    this.mainState.update('headTitle', 'Arianna Web > Home');
    this.mainState.update('pageTitle', 'Arianna Web: Home Layout');

    this.lastWindowWidth=window.outerWidth;
    fromEvent( window , "resize" ).pipe(debounce(() => interval(200))).
    subscribe( () => {
      // only resets the bubbles if the window's width has changed
      if(this.lastWindowWidth!=window.outerWidth){
        this.lastWindowWidth=window.outerWidth;
        this.updateBubblesAndItemPreviews(true);
      }
    });
  }

  onBubbleTooltipClick(source:string, payload){
    switch(source){
      case 'select':
        if(!payload) return;
        const bubbleId = this.convertEntityIdToBubbleId(payload.entityId);
        if(!bubbleId) return;
        let bubble = null;
        if(this._bubbleChart){
          this._bubbleChart.selectAll(`g`).each( b => {
            if(b.id===bubbleId) bubble=b;
          });
          if(bubble) this.onBubbleSelected(bubble);
        }
        break;
      default:
        break;
    }
  }


  onBubbleMouseEnter(payload){
    if(!payload || !payload.bubble) return;
    const bubbleId = payload.bubble.id;
    let hoverEntityId = this.entityBubbleIdMap[payload.bubble.id];
    for(var i=0;i<this.allBubbles.length;i++){
      let bubble = this.allBubbles[i];
      if(bubble.entity.id===hoverEntityId){
        this.currentHoverEntity = bubble.entity;
        this.currentHoverEntity.count = bubble.count;
        break;
      }
    }
    if(this.bubblePopup){
      this.bubblePopup.hide();
      this.bubblePopup.destroy();
      this.bubblePopup = null;
    }
    setTimeout( () => {
      let template = document.getElementById("bubble-popup-menu");
      let templateClone = template.cloneNode(true);
      templateClone['style'].display = "inline-block";
      this.bubblePopup = this.tippy(`#${bubbleId}`, {
        content: templateClone,
        trigger: 'manual',
        interactive: true,
        arrow: true,
        theme: 'light-border no-padding',
        placement: 'top-middle',
        maxWidth: 500,
        //onHidden: () => console.log('hidden'),
      })[0];
      setTimeout( () => { if(this.bubblePopup) this.bubblePopup.show() } , 800 );
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

    // scroll control
    this._scrollBackgroundControl();
  }

  public onBubbleSelected(bubble){
    if(bubble){
      if(!this.selectedBubbles.includes(bubble)){
        if(this.selectedBubbles.length<this.maxBubblesSelectable){
          this.selectedBubbles.push(bubble);
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
        itemsPagination:{ offset:0, limit: this.configuration.get('home-layout')['results-limit'] }
      },
    }).subscribe((response) => {
      if(!onlyBubbles){
        this.renderPreviewsFromApolloQuery(response);
        this.renderItemTags();
      }
      this.setAllBubblesFromApolloQuery(response,true);
    });
  }

  private convertEntityIdToBubbleId(entityId:string) :string {
    if(!entityId) return null;
    return ( 'B_'+entityId.replace(/-/g,'_') );
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
            color: this.configuration.get("config-keys")[currentToE.countData.type.configKey]['color']['hex']
          });
      }
    }
    this.entityBubbleIdMap = {};
    this.allBubbles.forEach( (bubble) => {
      // d3/svg does not allow Number as beginning of ID.
      // d3/svg does not allow '-' as part of ID.
      bubble.id = this.convertEntityIdToBubbleId(bubble.entity.id);
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

  private _scrollBackgroundControl(){
    const el = document.getElementById('bubble-results-list'), 
      source$ = fromEvent(document.getElementById('bubble-results-list'), 'scroll');

    // height control
    setTimeout(() => {
      this._setHasScrollBackground(el);
    }, 500);

    // scroll listen
    source$.pipe(
      debounceTime(50)
    ).subscribe(({ target }: { target: any }) => {
      this._setHasScrollBackground(target);
    });
  }

  private _setHasScrollBackground({ scrollTop, scrollHeight, clientHeight }){
    this.hasScrollBackground = scrollHeight > (scrollTop + clientHeight);
  }
}