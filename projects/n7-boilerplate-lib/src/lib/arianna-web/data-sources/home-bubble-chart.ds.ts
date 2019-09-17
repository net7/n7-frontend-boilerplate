import { DataSource } from '@n7-frontend/core';
import { BUBBLECHART_MOCK } from '@n7-frontend/components';

export class AwHomeBubbleChartDS extends DataSource {

  protected transform(data){
    console.log('realBubbleData',data);
    console.log('mockBubbleData',BUBBLECHART_MOCK);


    const cWidth = 1500;
    const cHeight = 700;

    let bubblesData = {
      containerId: "bubbleChartContainer",
      containerWidth : cWidth,
      containerHeight : cHeight,
      isForceSimulationEnabled: true,
    };

    bubblesData['bubblesData'] = [];

    data.forEach( bubble => {
      let bId = 'B_'+bubble.entity.id.replace(/-/g,'_');
      let bubbleData = {
        id:bId,
        texts: [
          {
            id:bId+"_label0",
            label: bubble.entity.label,
            x_function: (d) => d.x,
            y_function: (d) => d.y-(d.radius/9),
            "user_select":"none",
            fontSize_function: (d) => d.radius/5,
            color: "white",
            "classes":""
          },
          {
            id:bId+"_label1",
            label: bubble.count,
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
        "radius":bubble.count/950,
        color:bubble.color,
        hasCloseIcon: false,
        payload:{
          id: bId
        }
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


    return bubblesData;
  }
}