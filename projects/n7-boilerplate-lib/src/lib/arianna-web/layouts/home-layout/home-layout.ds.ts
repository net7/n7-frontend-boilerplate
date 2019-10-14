import { LayoutDataSource } from '@n7-frontend/core';
import { fromEvent, interval, Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  private tippy: any;
  private configuration: any;
  private facetData: any[] = null;
  private facetInputs: any = {};
  // all the bubbles as they have been given by apollo
  // (the objects in the allBubbles are not the same bubble objects
  // present in the bubble chart)
  private allBubbles: any[] = null;
  private autocompletePopover: any;
  private autocompletePopoverOpen: boolean = false;
  private autocompleteChanged$: Subject<string> = new Subject();
  // the bubbles currently selected (this are saved from the event handler's
  // and correspond exactly to the bubblechart's bubble objects)
  public selectedBubbles: any[] = [];
  public numOfItemsStr: string = null;
  // instance of the bubble chart (from which you can access all the various
  // bubble objects)
  private _bubbleChart: any = null;
  // the maximum number of bubbles which can be selected at the same time
  private maxBubblesSelectable:number = 3;
  // entities have their own unique id, these ids are generic and are very flexible
  // bubbles (as the bubble chart's objects) have unique ids but do not allow certain
  // characters, so each bubble has its own id different from the id of the entity which
  // the bubble represents (given an bubble's id called bubbleId you can obtain the
  // respective entity's id with as: entityId = entityBubbleIdMap[bubbleId] )
  private entityBubbleIdMap: any = {};
  // widh of the window which is updated at each resize and it is used by the bubble
  // chart to check if the width of the window has changed during the last resize
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
            enabled: true,
            locked: false,
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
      // (if the resize only effects the window's hight then the bubble chart
      // doesn't get reset)
      if(this.lastWindowWidth!=window.outerWidth){
        this.lastWindowWidth=window.outerWidth;
        this.updateBubblesAndItemPreviews(true);
      }
    });

    // listen autocomplete changes
    this._listenAutoCompleteChanges();
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

    this.one('aw-linked-objects').updateOptions({ context: 'home', configKeys: this.configuration.get('config-keys')})
    this.one('aw-linked-objects').update(response.itemsPagination.items);

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

  /**
   * updates the bubble chart and the item previews based on the currently
   * selected bubbles
   *
   * @param onlyBubbles specifies if only the bubble chart should be updated,
   *                    leaving the item previews as they are
   */
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

  /**
   * converts the id of an entity to the id of a bubble
   * ( // d3/svg does not allow Number as beginning of ID.
   *   // d3/svg does not allow '-' as part of ID. )
   * @param entityId id of the entity
   */
  private convertEntityIdToBubbleId(entityId:string) :string {
    if(!entityId) return null;
    return ( 'B_'+entityId.replace(/-/g,'_') );
  }

  /**
   * sets the this.allBubbles variable based on the response apollo has given
   * for the globalFilterQuery
   *
   * @param response apollo's response
   * @param reset true if the bubble chart has to be reset/redrawn
   */
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
    let enabledFacets = this.facetData.filter( f => f.enabled ).length -1;
    this.facetData.forEach( f => {
        if (f.type.id === facetId && f.locked === true) {
          // if user clicked on a locked facet, ignore it
          return
        }
        if(f.type.id === facetId){
          // if this is the clicked facet
          if( f.enabled && enabledFacets >= 1 ){
            f.enabled = false;
            f.locked = false;
            updateBubbles = true;
          } else {
            f.enabled = true;
            f.locked = false;
            updateBubbles = true;
          }
        } else {
          // if this is another facet
          if ( enabledFacets === 1 && f.enabled ) {
            f.locked = true;
          } else {
            f.locked = false;
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

  onHeroChange(value){
    this.autocompleteChanged$.next(value);
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

  private _listenAutoCompleteChanges(){
    this.one('aw-home-autocomplete').updateOptions({ config: this.configuration.get('config-keys') });

    this.autocompleteChanged$.pipe(
      debounceTime(500)
    ).subscribe(value => {

      if(value){
        this.communication.request$('autoComplete', {
          onError: (error) => console.error(error),
          params: {
            input: value,
            itemsPagination:{ offset:0, limit: this.configuration.get('home-layout')['results-limit'] }
          }
        }).subscribe((response) => {
          this.one('aw-home-autocomplete').update(response);
          if(!this.autocompletePopoverOpen) this._toggleAutocompletePopover();
        });
      } else {
        this._toggleAutocompletePopover();
      }
    });
  }

  private _toggleAutocompletePopover(){
    if(!this.autocompletePopover){
      const template = document.getElementById('aw-home-advanced-autocomplete-popover');
      template.style.display = 'block';
  
      this.autocompletePopover = this.tippy('.aw-home__top-hero .n7-hero__input', {
        content: template,
        trigger: 'manual',
        interactive: true,
        arrow: false,
        appendTo: 'parent',
        theme: 'light-border',
        placement: 'bottom-start',
        maxWidth: '100%',
        onHidden: () => this.autocompletePopoverOpen = false,
      })[0];
    }
    
    if(this.autocompletePopoverOpen){
      this.autocompletePopover.hide();
    } else {
      this.autocompletePopover.show();
    }

    this.autocompletePopoverOpen = !this.autocompletePopoverOpen;
  }
}