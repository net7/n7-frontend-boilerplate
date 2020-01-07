import { EventHandler } from '@n7-frontend/core';

export class DvDatepickerWrapperEH extends EventHandler {
    public listen() {
        this.innerEvents$.subscribe(({ type, payload }) => {
            switch(type){
              case 'dv-datepicker-wrapper.click':
                this.dataSource.getDatepicker(payload);
                break;
              case 'dv-datepicker-wrapper.open-close':
                this.dataSource.toggleDropDown();
                break;
              case 'dv-datepicker-wrapper.change':
                this.dataSource.setLabel(payload);
                break;
            }
          });
    }
}