import { EventHandler } from '@n7-frontend/core';

export class HeaderEH extends EventHandler {

  public listen(){
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch(type){
        case 'header.click':
          // navigate control
          if(payload.source === 'navigate'){
            this.emitGlobal('navigate', payload);
          }

          // global signal
          this.emitGlobal(type, payload);
          break;

        default:
          break;
      }
    });
  }

}
