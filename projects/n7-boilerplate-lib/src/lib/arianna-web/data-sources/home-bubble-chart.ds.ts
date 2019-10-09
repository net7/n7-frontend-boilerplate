import { DataSource } from '@n7-frontend/core';
import { BUBBLECHART_MOCK } from '@n7-frontend/components';

export class AwHomeBubbleChartDS extends DataSource {

  // threshold below which a bubble should not show its title
  private thresholdShowTitle:number = 50;
  // threshold below which a bubble should not show its number
  private thresholdShowValue:number = 60;

  protected transform(data){
    if(!data) return null;
    let bubbleCointainer = document.getElementById("bubble-chart-container");
    const cWidth = bubbleCointainer.offsetWidth;
    // now the bubblechart's height is hardcoded to 700, not sure
    // how it sould be actually set
    // TODO: think of a good way to pass/compute cHeight
    const cHeight = 700; // bubbleCointainer.offsetHeight

    const containerSize = cWidth*cHeight;

    // generic data of the bubble chart
    let bubblesData = {
      containerId: "bubbleChartContainer",
      containerWidth : cWidth,
      containerHeight : cHeight,
      isForceSimulationEnabled: true,
      maxBubblesSelected:3
    };

    // data about each single bubble (starts as [] and gets filled)
    bubblesData['bubblesData'] = [];

    // first loop over all the data's bubbles to gather various numbers, such
    // as the maximum/minimum bubble value and number of selected bubbles
    let maxBubbleValue=-1;
    let minBubbleValue=-1;
    let numOfBubbles=0;
    let totalValues=0;
    let numOfSelectedBubbles=0;
    data.bubbles.forEach( bubble => {
      if(maxBubbleValue<bubble.count) maxBubbleValue=bubble.count;
      if(minBubbleValue<0 || minBubbleValue>bubble.count) minBubbleValue=bubble.count;
      numOfBubbles++;
      totalValues+=bubble.count;
      if(bubble.selected) numOfSelectedBubbles++;
    });

    // second loop  over all the data's bubbles, for each bubble a corresponding object
    // is created and addded to the bubblesData array
    data.bubbles.forEach( bubble => {
      let bId = bubble.id;
      // here I compute the bubble's radius (could/should be improved), for it I compute a percentage of the bubble's value
      // compared to all the bubbles and use that percentage to compute the bubble's radius
      // Note : I also use the containerSize and the number of bubbles, ideally also the totValues and
      //        numOfSelectedBubbles should be considered when computing the radius
      //        (selected bubbles are in theory larger bubbles so taking that into account
      //         could help for the radius computation)
      // Note : the radius computation is very important, if the bubbles' radiuses are too big then
      //        the bubbles will go one over the other and will not be able to move as they should, if
      //        the rediuses are instead too small then the bubbles will be to small and conver only a
      //        portion of the container
      let bubblePercentage = ( bubble.count - (minBubbleValue/3) )/( (maxBubbleValue*3) - (minBubbleValue/3) );
      //let bubbleRadius = 2*( ((containerSize/(numOfBubbles*(totalCount/600)))*bubblePercentage)/( Math.pow(numOfSelectedBubbles+1,1.8)) );
      let bubbleRadius = (Math.log(containerSize)/10)*(bubblePercentage*3)*(70-Math.sqrt(numOfBubbles));

      // creation of the bubbleData object
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

    // force simulation's parameters for the bubble chart
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