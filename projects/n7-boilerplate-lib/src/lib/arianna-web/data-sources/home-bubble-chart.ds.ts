import { DataSource } from '@n7-frontend/core';
import { BUBBLECHART_MOCK } from '@n7-frontend/components';

export class AwHomeBubbleChartDS extends DataSource {

  private thresholdShowTitle:number = 50;
  private thresholdShowValue:number = 60;

  protected transform(data){
    if(!data) return null;
    let bubbleCointainer = document.getElementById("bubble-chart-container");
    const cWidth = bubbleCointainer.offsetWidth;
    // TODO: think of a good way to pass/compute cHeight
    const cHeight = 700; // bubbleCointainer.offsetHeight

    const containerSize = cWidth*cHeight;

    let bubblesData = {
      containerId: "bubbleChartContainer",
      containerWidth : cWidth,
      containerHeight : cHeight,
      isForceSimulationEnabled: true,
      maxBubblesSelected:3
    };

    bubblesData['bubblesData'] = [];

    let maxBubbleCount=-1;
    let minBubbleCount=-1;
    let numOfBubbles=0;
    let totalCount=0;
    let numOfSelectedBubbles=0;
    data.bubbles.forEach( bubble => {
      if(maxBubbleCount<bubble.count) maxBubbleCount=bubble.count;
      if(minBubbleCount<0 || minBubbleCount>bubble.count) minBubbleCount=bubble.count;
      numOfBubbles++;
      totalCount+=bubble.count;
      if(bubble.selected) numOfSelectedBubbles++;
    });
    data.bubbles.forEach( bubble => {
      let bId = bubble.id;
      //let bubblePercentage = ( bubble.count - (minBubbleCount/3) )/( (maxBubbleCount*3) - (minBubbleCount/3) );
      //let bubbleRadius = 2*( ((containerSize/(numOfBubbles*(totalCount/600)))*bubblePercentage)/( Math.pow(numOfSelectedBubbles+1,1.8)) );
      let bubblePercentage = ( bubble.count - (minBubbleCount/3) )/( (maxBubbleCount*3) - (minBubbleCount/3) );
      let bubbleRadius = (Math.log(containerSize)/10)*(bubblePercentage*3)*(70-Math.sqrt(numOfBubbles));
      let bubbleData = {
        id: bId,
        texts: [
          {
            id:bId+"_label0",
            label: (d) => { if(d.radius<this.thresholdShowTitle) return null; return bubble.entity.label },
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
          },
          {
            id:bId+"_label1",
            label: (d) => { if(d.radius<this.thresholdShowValue) return null; return bubble.count },
            x_function: (d) => d.x,
            y_function: (d) => d.y+(d.radius/9),
            "user_select":"none",
            fontSize_function: (d) => d.radius/6,
            color: "white",
            "classes":""
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
    return bubblesData;
  }
}