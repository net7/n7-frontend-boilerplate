import { EventHandler } from '@n7-frontend/core';

export class DvDatepickerWrapperEH extends EventHandler {
    public listen() {
        this.innerEvents$.subscribe(({ type, payload }) => {
          console.log("DP-INNER --> "+type);
            switch(type){
              case 'dv-datepicker-wrapper.click':
                this.emitOuter('set-select-lable', payload);
                this.dataSource.setDatepicker(payload);
                break;
              case 'dv-datepicker-wrapper.open':
                this.dataSource.openDropDown();
                break;
              case 'dv-datepicker-wrapper.change':
                this.dataSource.setDate(payload)
                break;
              // case 'dv-datepicker-wrapper.close-datepicker':
              //   this.emitOuter('close-datepicker', payload)
              // break;
            }
          });
        
        this.outerEvents$.subscribe(({type, payload}) => {
          console.log("DP-OUTER --> "+type);
        });
    }
}