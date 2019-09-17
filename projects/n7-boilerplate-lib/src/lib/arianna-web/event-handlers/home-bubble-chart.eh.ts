import { EventHandler } from '@n7-frontend/core';

export class AwHomeBubbleChartEH extends EventHandler {

  public listen() {
    console.log('LISTEN!!!');
    this.innerEvents$.subscribe(event => {
      console.log({event});
    });
    /*
    this.outerEvents$.subscribe(event => {
      
    });
    */
  }

}