import { EventHandler } from '@n7-frontend/core';

export class DvExampleLayoutEH extends EventHandler {

  public listen() {
    this.innerEvents$.subscribe(({type, payload}) => {
      this.dataSource.onInit();
    });
    
    this.outerEvents$.subscribe(({type, payload}) => {
      switch(type){
        case 'dv-datepicker-wrapper.set-select-lable':
          console.log("DV-LY -->" + type);
          this.dataSource.setSelectLable(payload);
          break;
      }
      
    });
  }
}