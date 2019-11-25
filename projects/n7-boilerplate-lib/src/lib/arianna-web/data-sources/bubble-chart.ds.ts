import { DataSource } from '@n7-frontend/core';
import tippy from 'tippy.js';
import { fromEvent, interval } from 'rxjs';
import { debounce } from 'rxjs/operators';

export class AwBubbleChartDS extends DataSource {

  private thresholdShowTitle:number = 50;
  private thresholdShowValue:number = 60;
  public configuration: any;
  private allBubbles: any[] = null;
  private entityBubbleIdMap: any = {};
  public selectedBubbles: any[] = [];
  private facetData: any[] = null;
  private bubblePopup: any = null;
  public currentHoverEntity: any = null;
  private _bubbleChart: any = null;
  private maxBubblesSelectable:number = 3;
  private tippy;
  private windowResizeSet = false;
  private maxBubbleRadius = 100;
  private minBubbleRadius = 10;
  private maxBubbleTextRadiusRatio = 6;

  protected transform(data){
    if ( !data ){ return null; }

    this.destroyTooltip();

    this.facetData = data.facetData ? data.facetData : [];
    this.tippy = tippy;

    data.bubbles = this.filterBubblesBasedOnFacetsEnabled();
    let bubbleCointainer = document.getElementById(this.options.containerId);
    const cWidth = data.width ? data.width : bubbleCointainer.offsetWidth;

    // TODO: think of a good way to pass/compute cHeight
    const cHeight = 700; // bubbleCointainer.offsetHeight
    const containerSize = cWidth * cHeight;

    let bubblesData = {
      containerId: this.options.bubbleContainerId,
      containerWidth : cWidth,
      containerHeight : cHeight,
      isForceSimulationEnabled: true,
      maxBubblesSelected:3
    };

    bubblesData['bubblesData'] = [];

    let maxBubbleCount = -1;
    let minBubbleCount = -1;
    let numOfBubbles = 0;
    let totalCount = 0;
    let numOfSelectedBubbles = 0;

    data.bubbles.forEach( bubble => {
      if ( maxBubbleCount < bubble.count ) maxBubbleCount = bubble.count;
      if ( minBubbleCount < 0 || minBubbleCount>bubble.count ) minBubbleCount = bubble.count;
      numOfBubbles++;
      totalCount += bubble.count;
      if(bubble.selected) numOfSelectedBubbles++;
    });

    data.bubbles.forEach( bubble => {
      let bId = bubble.id;

      let bubbleAverage =  totalCount / numOfBubbles;
      let bubblePercentage = ( bubble.count - (minBubbleCount/3) )/( (maxBubbleCount*3) - (minBubbleCount/3) );


      //to understand if there is a large difference of count between bubbles
      let coeff = maxBubbleCount / bubbleAverage;

      /* if ( coeff > 20 ) {
        if ( bubble.count - coeff >= 0 ){
          bubblePercentage = ( (bubble.count) - (minBubbleCount/3) )/( (maxBubbleCount*3) - (minBubbleCount/3) )
        } else {
        }
        bubblePercentage = ( (bubble.count - (minBubbleCount/3)) - (minBubbleCount/3) )/( ((maxBubbleCount - coeff) *3) - (minBubbleCount/3) )
      }*/

      /* In case of few bubbles */
      if( coeff > 1 ) {
        bubblePercentage = ( bubble.count * (coeff/3) - (minBubbleCount/3) )/( (maxBubbleCount*3) - (minBubbleCount/3) );
      }

      let bubbleRadius = (Math.log(containerSize)/10)*(bubblePercentage*3)*(70-Math.sqrt(numOfBubbles));
      if ( bubbleRadius > this.maxBubbleRadius ) {
        bubbleRadius = this.maxBubbleRadius;
      } else if ( bubbleRadius < this.minBubbleRadius ) {
        bubbleRadius = this.minBubbleRadius;
      }

      //console.log("bubble text " +  bubble.entity.label +" bubble length " +  bubble.entity.label.length + " radius: " + bubbleRadius + " limit: " + this.thresholdShowTitle  )
      let label = bubble.entity.label;

      let texts = [];
      // check if text is larger than radius
      if( bubbleRadius / bubble.entity.label.length < this.maxBubbleTextRadiusRatio ) {
        const index = bubbleRadius / this.maxBubbleTextRadiusRatio;
        const spaceIndex = bubble.entity.label.indexOf(" ", index - 5)
        const label1 = bubble.entity.label.slice(0, spaceIndex);
        const label2 = bubble.entity.label.slice(spaceIndex, index *2);
        //label = [bubble.entity.label.slice(0, index), "\n", bubble.entity.label.slice(index)].join('');

        texts.push(
          {
            id:bId+"_label0",
            label: (d) => { if(d.radius<this.thresholdShowTitle) return null; return label1 },
            x_function: (d) => d.x,
            y_function: (d) => {
              let mNum = (d.radius/9);
              if(d.radius<this.thresholdShowValue) mNum=0;
              return d.y-mNum -20;
            },
            "user_select":"none",
            fontSize_function: (d) => d.radius/5,
            color: "white",
            "classes":""
          },
          {
            id:bId+"_label01",
            label: (d) => { if(d.radius<this.thresholdShowTitle) return null; return label2 },
            x_function: (d) => d.x,
            y_function: (d) => {
              let mNum = (d.radius/9);
              if(d.radius<this.thresholdShowValue) mNum=0;
              return d.y-mNum;
            },
            "user_select":"none",
            fontSize_function: (d) => d.radius/5,
            color: "white",
            "classes":""
          }


        )
      } else {
        texts.push({
          id:bId+"_label0",
          label: (d) => { if(d.radius<this.thresholdShowTitle) return null; return label },
          x_function: (d) => d.x,
          y_function: (d) => {
            let mNum = (d.radius/9);
            if(d.radius<this.thresholdShowValue) mNum=0;
            return d.y-mNum;
          },
          "user_select":"none",
          fontSize_function: (d) => d.radius/5,
          color: "white",
          "classes":""
        });
      }

      let bubbleData = {
        id: bId,
        texts: [
          ...texts,
          {
            id:bId+"_label1",
            label: (d) => { if(d.radius<this.thresholdShowValue) return null; return bubble.count },
            x_function: (d) => d.x,
            y_function: (d) => d.y+(d.radius/9),
            "user_select":"none",
            //fontSize_function: (d) => d.radius/3,
            color: "white",
            "classes":"aw-bubble-num"
        }
        ],
        x: cWidth/2+50,
        y: cHeight/2+50,
        "radius": bubbleRadius,
        color:bubble.color,
        hasCloseIcon: ( bubble.selected ? bubble.selected : false ),
        payload:{
          id: bId
        },
      };

      bubblesData['bubblesData'].push(bubbleData);
    });


    bubblesData['forceSimulationData'] = {
      xPull: cWidth/2,
      xPullStrength: -0.01,
      yPull: cHeight/2,
      yPullStrength: -0.01,
      collisionStrengh: 0.99,
      collisionIterations: 1,
      velocityDecay: 0.65
    }

    if(data.reset) bubblesData['reset'] = data.reset;

    if(data.setUpdateReference) bubblesData['setUpdateReference'] = data.setUpdateReference;
    if(data.setBubbleChart) bubblesData['setBubbleChart'] = data.setBubbleChart;

    this.setWindowResize();

    return bubblesData;
  }

  setAllBubblesFromApolloQuery( data: any, reset = true ) {
    const response = data.source;
   // if ( !response || !response.entitiesData ) {return; }
    this.allBubbles = [];

    if ( data.selectedBubbles ) {
      this.selectedBubbles = data.selectedBubbles;
    }

    if( response.entitiesData ) {

      for ( let i = 0 ; i < response.entitiesData.length; i++ ) {

        this.allBubbles.push({
          ...response.entitiesData[i],
          color: this.options.configKeys[response.entitiesData[i].entity.typeOfEntity.replace(" ", "-")] ? this.options.configKeys[response.entitiesData[i].entity.typeOfEntity.replace(" ", "-")]['color']['hex'] : ""
        })
      }

    }
    else {
      for ( let i = 0; i < response.relatedEntities.length; i++ ){
        const color = this.options.configKeys ?
          this.options.configKeys[response.relatedEntities[i].entity.typeOfEntity.replace(" ", "-")] ? this.options.configKeys[response.relatedEntities[i].entity.typeOfEntity.replace(" ", "-")]['color']['hex'] : "" :
          null;
        this.allBubbles.push(
          {
            id: this.convertEntityIdToBubbleId( response.relatedEntities[i].entity.id ),
            ...response.relatedEntities[i],
            color: color
          });
      }
    }

    this.entityBubbleIdMap = {};
    this.allBubbles.forEach( (bubble) => {
      // d3/svg does not allow Number as beginning of ID.
      // d3/svg does not allow '-' as part of ID.
      bubble.id = this.convertEntityIdToBubbleId(bubble.entity.id);
      this.entityBubbleIdMap[bubble.id] = bubble.entity.id;
      return bubble;
    });
    this.allBubbles.forEach( (bubble) => {
      bubble.selected = false;
      for( var i = 0; i < this.selectedBubbles.length; i++ ){
        if ( this.selectedBubbles[i].id === bubble.id ) {
          bubble.selected = true;
        }
      }
    });

    if(reset) {
      this.update(data);
    }
  }

  private convertEntityIdToBubbleId(entityId: string): string {
    if ( !entityId ) { return null; }
    return ( 'B_' + entityId.replace(/-/g, '_') );
  }

  filterBubblesBasedOnFacetsEnabled() {
    var count = 0;
    let result = this.allBubbles.filter(
      (bubble) => {
        for ( var i = 0; i < this.facetData.length; i++ ){
          if (bubble.entity.typeOfEntity.replace(/ /g, '-') === this.facetData[i].type.replace(/ /g, '-') ) {
            if ( !this.facetData[i].enabled ) { return false; }
          }
        }
        if( count > this.options.maxNumber ) {
          return false;
        }
        count++;
        return true;
      }
    );
    return result;
  }

  onBubbleMouseEnter(payload){
    if ( !payload || !payload.bubble ) return;
    const bubbleId = payload.bubble.id;
    let hoverEntityId = this.entityBubbleIdMap[payload.bubble.id];
    for (var i = 0; i < this.allBubbles.length; i++ ){
      let bubble = this.allBubbles[i];
      if ( bubble.entity.id===hoverEntityId ){
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
        allowHTML: true,
        trigger: 'manual',
        interactive: true,
        arrow: true,
        theme: 'light-border no-padding',
        placement: 'top',
        maxWidth: 500,
        //onHidden: () => console.log('hidden'),
      })[0];
      setTimeout( () => { if(this.bubblePopup) this.bubblePopup.show() } , 800 );
    });
  }

  destroyTooltip(){
    if(this.bubblePopup){
      this.bubblePopup.hide();
      this.bubblePopup.destroy();
      this.bubblePopup = null;
    }
  }

  onBubbleTooltipClick(source:string, payload){
    switch(source){
      case 'select':
        if(!payload) return;
        const bubbleId = this.convertEntityIdToBubbleId(payload.entityId);
        if(!bubbleId) return;
        let bubble = null;
        if(payload._bubbleChart){
          payload._bubbleChart.selectAll(`g`).each( b => {
            if(b.id===bubbleId) bubble=b;
          });
          if(bubble) return bubble;
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
          //return this.filterRequest();
        }
      }
    }
  }

  public getBubbleFromId(id){
    const bubbleId = this.convertEntityIdToBubbleId(id);
    if(!bubbleId) return;
    let bubble = null;
    if(this._bubbleChart){
      this._bubbleChart.selectAll(`g`).each( b => {
        if(b.id===bubbleId) bubble=b;
      });
      if(bubble) return bubble;
    }
  }

  getSelectedBubbles() {
    return this.selectedBubbles;
  }

  getAllBubbles() {
    return this.allBubbles;
  }

  getEntityIdMap() {
    return this.entityBubbleIdMap;
  }

  setWindowResize() {
    if( !this.windowResizeSet){
      fromEvent( window , "resize" ).pipe(debounce(() => interval(200))).
      subscribe( () => {
        // only resets the bubbles if the window's width has changed
        // (if the resize only effects the window's hight then the bubble chart
        // doesn't get reset)
          const container = document.getElementById(this.options.containerId);
          //check if element is visible on page
          if(container.offsetParent != null) {

            let bubblePayload = {
              width: container.offsetWidth,
              reset: true
            };
            this.update(bubblePayload);
          }
        })
        this.windowResizeSet = true;
    }

  }

}
