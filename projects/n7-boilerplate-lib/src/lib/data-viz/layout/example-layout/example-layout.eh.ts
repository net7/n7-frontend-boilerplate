import { EventHandler } from '@n7-frontend/core';

export class DvExampleLayoutEH extends EventHandler {

  public listen() {
    this.outerEvents$.subscribe(({ type, payload }) => {
      console.log("LAYOUT-OUTER --> "+type);
      switch(type){
        case 'dv-datepicker-wrapper.datepicker-click':
            this.dataSource.setDatepicker(payload);
          break;
        case 'dv-datepicker-wrapper.openDropDown':
          this.dataSource.openDropDown(payload);
        break;
        case 'dv-datepicker-wrapper.set-custom-date':
          this.dataSource.setDate(payload);
        break;
        case 'dv-datepicker-wrapper.document-click':
          this.dataSource.setDatepicker(payload);
        break;
      }
    });
    this.innerEvents$.subscribe(({type, payload}) => {
      console.log("LAYOUT-INNER --> "+type);
    });
  } 
}