import { EventHandler } from '@n7-frontend/core';

export class AwHomeItemTagsWrapperEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe( (event) => {
      switch(event.type){
        case "aw-home-item-tags-wrapper.click":
          this.emitOuter('click',event.payload);
          break;
        default:
          break;
      }
    });
    /* this.outerEvents$.subscribe(event => {
    
    }); */
  }

}