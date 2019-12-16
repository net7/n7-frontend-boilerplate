import { EventHandler } from '@n7-frontend/core';

export class DvDatepickerWrapperEH extends EventHandler {
    public listen() {
        this.innerEvents$.subscribe(({ type, payload }) => {
          console.log("DP-INNER --> "+type);
            switch(type){
              case 'dv-datepicker-wrapper.click':
                this.emitOuter('datepicker-click', payload)
                break;
              case 'dv-datepicker-wrapper.open':
                this.emitOuter('openDropDown', payload)
              break;
              case 'dv-datepicker-wrapper.change':
                this.emitOuter('set-custom-date', payload)
              break;
              case 'dv-datepicker-wrapper.document-click':
                this.emitOuter('document-click', payload)
              break;
            }
          });
        
        this.outerEvents$.subscribe(({type, payload}) => {
          console.log("DP-OUTER --> "+type);
        });
    }
}