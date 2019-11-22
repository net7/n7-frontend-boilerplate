import { LayoutDataSource } from '@n7-frontend/core';
import { fromEvent, Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';

export class AwHomeLayoutDS extends LayoutDataSource {
  private communication: any;
  private mainState: any;
  private tippy: any;
  private configuration: any;
  private facetData: any[] = null;
  private lockedFacets = {};
  private lockLastFacet: boolean = false;
  private facetInputs: any = {};
  // all the bubbles as they have been given by apollo
  // (the objects in the allBubbles are not the same bubble objects
  // present in the bubble chart)
  private allBubbles: any[] = null;
  private autocompletePopover: any;
  private autocompletePopoverOpen: boolean = false;
  private autocompleteChanged$: Subject<string> = new Subject();
  // the bubbles currently selected (these are saved from the event handler's
  // and correspond exactly to the bubblechart's bubble objects)
  public selectedBubbles: any[] = [];
  public numOfItemsStr: string = null;
  // instance of the bubble chart (from which you can access all the various
  // bubble objects)
  private _bubbleChart: any = null;
  // the maximum number of bubbles which can be selected at the same time
  private maxBubblesSelectable: number = 3;
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
  public loadingBubbles = false;
  public bubblesEnabled = false;
  public resultsLimit = -1;
  public selectedEntitiesIds = [];
  public outerLinks:any;
  public outerLinksTitle:string;

  onInit({ communication, mainState, configuration, tippy }) {
    this.communication = communication;
    this.configuration = configuration;
    this.facetData = [];
    this.lastWindowWidth = window.outerWidth;
    this.mainState = mainState;
    this.tippy = tippy;
    this.bubblesEnabled = this.configuration.get('features-enabled') ? this.configuration.get('features-enabled')['bubblechart'] : false;
    this.resultsLimit = this.configuration.get('home-layout')['results-limit']

    this.one('aw-hero').update(this.configuration.get('home-layout')['top-hero']);
    this.one('aw-home-hero-patrimonio').update(this.configuration.get('home-layout')['bottom-hero']);
    // update streams
    this.mainState.update('headTitle', 'Arianna Web > Home');
    this.mainState.update('pageTitle', 'Arianna Web: Home Layout');
    this.mainState.updateCustom('currentNav', 'aw/home');
    // listen autocomplete changes
    this._listenAutoCompleteChanges();

    this.outerLinks = this.configuration.get('home-layout')['outer-links']['test'];
    this.outerLinksTitle = this.configuration.get('home-layout')['outer-links']['title'];
  }

  public makeRequest$(query, params) {
    return this.communication.request$(query, {
      onError: (error) => console.error(error),
      params
    });
  }


  public updateComponent = (id, data, options?) => {
    if (options) {
      this.one(id).updateOptions(options)
    }
    this.one(id).update(data)
  }

  initialFilterRequest() {
    return this.communication.request$('globalFilter', {
      onError: (error) => console.error(error),
      params: {
        entitiesListSize: this.configuration.get("home-layout")['max-bubble-num'] * 4
      },
    })
  }

  parseInitialRequest(response) {
    response.typeOfEntityData.forEach((toe) => {
      const teoConfigData = this.configuration.get("config-keys")[toe.type.replace(" ", "-")];
      this.facetData.push({
        ...toe,
        enabled: true,
        locked: false,
        configKey: toe.type.replace(" ", "-"),
        ...teoConfigData
      });
    });
    this.one('aw-home-facets-wrapper').update({
      facetData: this.facetData,
      lockedFacets: this.lockedFacets
    });
    this.one('aw-bubble-chart').updateOptions({
      context: 'home',
      configKeys: this.configuration.get("config-keys"),
      bubbleContainerId: 'bubbleChartContainer',
      containerId: 'bubble-chart-container',
      maxNumber: this.configuration.get("home-layout")['max-bubble-num']
    });
    this.renderPreviewsFromApolloQuery(response);
  }

  renderPreviewsFromApolloQuery(response: any) {
    if (!response || !response.itemsPagination) {
      return
    };
    let numOfItems = response.itemsPagination.totalCount;
    if (numOfItems > 0) {
      let numOfThousand = 0;
      while (numOfItems > 999) {
        numOfItems -= 1000;
        numOfThousand += 1;
      }
      let numOfItemsTmpStr = numOfItems + '';
      if (numOfItems < 10) numOfItemsTmpStr = '00' + numOfItems;
      else if (numOfItems < 100) numOfItemsTmpStr = '0' + numOfItems;
      if (numOfThousand > 0)
        this.numOfItemsStr = numOfThousand + '.' + numOfItemsTmpStr;
      else
        this.numOfItemsStr = numOfItems + '';
    } else {
      this.numOfItemsStr = null;
    }
    this.one('aw-linked-objects').updateOptions({
      context: 'home',
      config: this.configuration,
      // page: 1,
    })
    this.one('aw-linked-objects').update(response.itemsPagination);
    if (document.getElementById('bubble-results-list')) { 
      // reset scroll position of result list
      document.getElementById('bubble-results-list').scrollTo(0,0)
    }
  }

  onBubbleTooltipClick(source: string, payload) {
    switch (source) {
      case 'select':
        if (!payload) return;
        const bubbleId = payload.bubbleId;
        if (!bubbleId) return;
        let bubble = null;
        if (this._bubbleChart) {
          this._bubbleChart.selectAll(`g`).each(b => {
            if (b.id === bubbleId) bubble = b;
          });
          if (bubble) this.onBubbleSelected(bubble);
        }
        break;
      default:
        break;
    }
  }

  public onBubbleSelected(bubble) {
    if (bubble) {
      if (!this.selectedBubbles.includes(bubble)) {
        if (this.selectedBubbles.length < this.maxBubblesSelectable) {
          this.loadingBubbles = this.selectedBubbles.length == 0;
          this.selectedBubbles.push(bubble);
          return true;
        }
      }
    }
    return null;
  }

  public onBubbleDeselected(payload) {
    if (payload && payload.bubble) {
      this.selectedBubbles = this.selectedBubbles.filter(
        (b) => b.id !== payload.bubble.id);
      if (payload.bubble.hasCloseIcon) {
        payload.bubble.hasCloseIcon = false;
        return this.filterRequest();
      }
    }
  }

  public getBubblePayload(response) {
    let bubblePayload = {
      reset: true,
      setBubbleChart: (bubbleCref) => this._bubbleChart = bubbleCref,
      facetData: this.facetData,
      source: response,
      selectedBubbles: this.selectedBubbles
    };
    return bubblePayload;
  }

  private filterRequest() {
    if (this.entityBubbleIdMap) {
      let k = this.configuration.get('config-keys')
      let activeBubbles = {
        places: false,
        people: false,
        concepts: false,
        organizations: false,
      }
      if (this.selectedBubbles.length <= 0) {
        this.selectedEntitiesIds = [];
      }
      this.selectedBubbles.forEach((sB) => {
        let c = sB.color
        let findTypeFromColor = (obj, color) => {
          return Object.keys(obj).find(key => obj[key].color.hex === color)
        }
        activeBubbles[findTypeFromColor(k, c)] = true
        let entityId = this.entityBubbleIdMap[sB.id];
        if (entityId)
          this.selectedEntitiesIds.push(entityId);
      });
      this.lockedFacets = activeBubbles
      this.one('aw-home-facets-wrapper').update({
        facetData: this.facetData,
        lockedFacets: this.lockedFacets
      });
    }
    return this.communication.request$('globalFilter', {
      onError: (error) => console.error(error),
      params: {
        selectedEntitiesIds: this.selectedEntitiesIds,
        itemsPagination: {
          offset: 0,
          limit: this.resultsLimit
        }
      },
    })
  }

  public updateBubbles(response, onlyBubbles?: boolean) {
    if (!onlyBubbles) {
      this.renderPreviewsFromApolloQuery(response);
    }
  }

  public updateBubbleFilter(data) {
    this.allBubbles = data.allBubbles;
    this.entityBubbleIdMap = data.entityIdmap;
  }

  public updateTags(onlyBubbles?: boolean) {
    if (!onlyBubbles) {
      this.renderItemTags();
    }
  }

  filterBubblesBasedOnFacetsEnabled() {
    let result = this.allBubbles.filter(
      (bubble) => {
        for (var i = 0; i < this.facetData.length; i++) {
          if (bubble.entity.typeOfEntity.id === this.facetData[i].type.id)
            if (!this.facetData[i].enabled) { return false; }
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

  handleFacetHeaderClick(facetId) {
    let updateBubbles = false;
    let enabledFacets = this.facetData.filter(f => f.enabled).length;
    this.facetData.forEach(f => {
      f.type = f.type.replace(/ /g, '-') // fix for space in facet type string ('cose notevoli')
      if (f.type === facetId && f.locked === true) {
        // if user clicked on a locked facet, ignore it
        return
      }
      if (f.type === facetId && f.enabled === true && enabledFacets < 1) {
        return
      }
      if (f.type === facetId) { // if this is the clicked facet
        console.log(`${f.type} is the clicked facet`)
        if (f.enabled && enabledFacets > 1) {
          f.enabled = false;
          f.locked = false;
          updateBubbles = true;
        } else {
          f.enabled = true;
          f.locked = false;
          updateBubbles = true;
        }
      } else { // if this is another facet
        if (enabledFacets <= 2 && f.enabled) {
          f.locked = true;
        } if (enabledFacets >= 1 && f.locked) {
          f.locked = false;
        }
      }
    });
    this.one('aw-home-facets-wrapper').update({
      facetData: this.facetData,
      lockedFacets: this.lockedFacets
    });
    if (updateBubbles) {
      let disableFacetsIds = [];
      this.facetData.forEach((fD) => {
        if (!fD.enabled) disableFacetsIds.push(fD.type); // this is probably useless
      });
      if (disableFacetsIds.length > 0) {
        let filteredSelectedBubbles = this.selectedBubbles.filter(bubble => {
          for (var i = 0; i < this.allBubbles.length; i++) {
            if (this.allBubbles[i].id === bubble.id) {
              if (disableFacetsIds.includes(
                this.allBubbles[i].entity.typeOfEntity.id
              )) {
                return false
              }
            }
          }
        });
        if (filteredSelectedBubbles.length != this.selectedBubbles.length) {
          this.selectedBubbles = filteredSelectedBubbles;
        };
      }
      this.allBubbles.forEach(bubble => {
        bubble.selected = false;
        for (var i = 0; i < this.selectedBubbles.length; i++) {
          if (this.selectedBubbles[i].id === bubble.id) bubble.selected = true;
        }
      });
      this.one('aw-bubble-chart').update(this.getBubblePayload(null));
    }
  }

  renderItemTags() {
    let tagsData = [];
    this.selectedBubbles.forEach((sBubble) => {
      let label = '';
      for (var i = 0; i < this.allBubbles.length; i++) {
        if (this.allBubbles[i].id === sBubble.id) {
          label = this.allBubbles[i].entity.label;
          tagsData.push({
            label,
            icon: "n7-icon-close",
            payload: sBubble.id,
            classes: `tag-${this.allBubbles[i].entity.typeOfEntity.replace(/ /g, '-')}`
          });
          break;
        }
      }
    });
    this.one('aw-home-item-tags-wrapper').update(tagsData);
  }

  onTagClicked(payload) {
    if (!payload) return;
    const bubbleId = payload;
    if (this._bubbleChart) {
      this._bubbleChart.selectAll(`g`).each(b => {
        if (b.id === bubbleId) b.hasCloseIcon = false;
      });
    }
    this.selectedBubbles = this.selectedBubbles.filter((b) => b.id !== payload);
    return this.filterRequest();
  }

  onHeroChange(value) {
    this.autocompleteChanged$.next(value);
  }

  private _scrollBackgroundControl() {
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

  private _setHasScrollBackground({ scrollTop, scrollHeight, clientHeight }) {
    this.hasScrollBackground = scrollHeight > (scrollTop + clientHeight);
  }

  private _listenAutoCompleteChanges() {
    this.one('aw-home-autocomplete').updateOptions({ config: this.configuration.get('config-keys') });
    this.autocompleteChanged$.pipe(
      debounceTime(500)
    ).subscribe(value => {
      if (value) {
        this.communication.request$('autoComplete', {
          onError: (error) => console.error(error),
          params: {
            input: value,
            itemsPagination: { offset: 0, limit: this.configuration.get('home-layout')['results-limit'] }
          }
        }).subscribe((response) => {
          this.one('aw-home-autocomplete').update(response);
          if (!this.autocompletePopoverOpen) this._toggleAutocompletePopover();
        });
      } else {
        this._toggleAutocompletePopover();
      }
    });
  }

  private _toggleAutocompletePopover() {
    if (!this.autocompletePopover) {
      const template = document.getElementById('aw-home-advanced-autocomplete-popover');
      template.style.display = 'block';
      this.autocompletePopover = this.tippy('.aw-home__top-hero .n7-hero__input', {
        content: template,
        trigger: 'manual',
        interactive: true,
        arrow: false,
        flip: false,
        appendTo: 'parent',
        theme: 'light-border',
        placement: 'bottom-start',
        maxWidth: '100%',
        onHidden: () => this.autocompletePopoverOpen = false,
      })[0];
    }
    if (this.autocompletePopoverOpen) {
      this.autocompletePopover.hide();
    } else {
      this.autocompletePopover.show();
    }
    this.autocompletePopoverOpen = !this.autocompletePopoverOpen;
  }
}