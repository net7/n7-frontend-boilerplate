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
        //this.updateBubblesAndItemPreviews(true);
      }
    });

    // listen autocomplete changes
    this._listenAutoCompleteChanges();
  }

  initialFilterRequest(){
    return this.communication.request$('globalFilter', {
      onError: (error) => console.error(error),
    })
  }

  parseInitialRequest(response) {
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
    this.one('aw-bubble-chart').updateOptions({
      context: 'home',
      configKeys: this.configuration.get("config-keys"),
    });
    this.renderPreviewsFromApolloQuery(response);
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

  onBubbleTooltipClick(source:string, payload) {
    switch(source){
      case 'select':
        if(!payload) return;
        const bubbleId =payload.bubbleId;
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

  public onBubbleSelected(bubble){
    if(bubble){
      if(!this.selectedBubbles.includes(bubble)){
        if(this.selectedBubbles.length<this.maxBubblesSelectable){
          this.selectedBubbles.push(bubble);
          return true;
        }
      }
    }
    return null;
  }

  public onBubbleDeselected(payload){
    if(payload && payload.bubble){
      this.selectedBubbles = this.selectedBubbles.filter(
        (b) => b.id!==payload.bubble.id );
      if(payload.bubble.hasCloseIcon){
        payload.bubble.hasCloseIcon=false;
        return this.filterRequest();
      }
    }
  }

  private filterRequest(){
    let selectedEntitiesIds = [];
    if(this.entityBubbleIdMap)
    this.selectedBubbles.forEach( (sB) => {
      let entityId = this.entityBubbleIdMap[sB.id];
      if(entityId)
        selectedEntitiesIds.push(entityId);
    });

    return this.communication.request$('globalFilter', {
      onError: (error) => console.error(error),
      params: {
        selectedEntitiesIds,
        itemsPagination:{ offset:0, limit: this.configuration.get('home-layout')['results-limit'] }
      },
    })
  }

  public updateBubbles(response, onlyBubbles?:boolean ) {
    if ( !onlyBubbles ) {
      this.renderPreviewsFromApolloQuery(response);
    }
  }

  public updateBubbleFilter(data) {
    this.allBubbles = data.allBubbles;
    this.entityBubbleIdMap = data.entityIdmap;
  }

  public updateTags(onlyBubbles?:boolean) {
    if(!onlyBubbles){
      this.renderItemTags();
    }
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
      this.one('aw-bubble-chart').update({
        width: window.innerWidth/1.8,
       // bubbles:this.filterBubblesBasedOnFacetsEnabled(),
        selectedBubbles: this.selectedBubbles,
        setBubbleChart: (bubbleCref) => this._bubbleChart = bubbleCref,
        facetData: this.facetData,
        reset:true
      });
    }
  }

  renderItemTags(){
    let tagsData = [];
    this.selectedBubbles.forEach( (sBubble) => {
      let label = '';
      for ( var i = 0; i < this.allBubbles.length; i++ ){
        if ( this.allBubbles[i].id === sBubble.id ){
          label = this.allBubbles[i].entity.label;
          tagsData.push({
            label,icon:"n7-icon-close",
            payload:sBubble.id,
            classes:"tag-"+ this.allBubbles[i].entity.typeOfEntity.id
          });
          break;
        }
      }
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
    return this.filterRequest();
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
        theme: 'light-border',
        placement: 'bottom-start',
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