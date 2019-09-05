import { EventHandler } from '@n7-frontend/core';

export class HeaderEH extends EventHandler {

  public listen(){
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case 'header.click':
          console.log(type, payload);
          break;

        default:
          break;
      }
    });
  }

}
