import { EventHandler } from '@net7/core';

export class DvDatepickerWrapperEH extends EventHandler {
  public listen() {
    this.innerEvents$.subscribe(({ type, payload }) => {
      switch (type) {
        case 'dv-datepicker-wrapper.click':
          this.dataSource.setLabel(payload);
          if (payload === 'ByDate') {
            this.dataSource.openDatepicker();
          } else {
            this.dataSource.closeDatepicker();
          }
          break;
        case 'dv-datepicker-wrapper.toggle':
          this.dataSource.toggleDropDown();
          break;
        case 'dv-datepicker-wrapper.change':
          this.dataSource.setLabel(payload.dateStr);
          break;
        default:
          break;
      }
    });
  }
}
