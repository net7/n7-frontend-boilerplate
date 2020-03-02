import { Component, Input } from '@angular/core';

export interface DatepickerWrapperData {
    select: Select;
    datepicker: any;
    payload?: any;
}

interface Select {
    id: string;
    hidden: boolean;
    icon?: string;
    label: string;
    items: DropdownItems[];
    classes?: string;
}

interface DropdownItems {
    text: string;
    payload: any;
    classes?: string;
}

@Component({
  selector: 'dv-datepicker-wrapper',
  templateUrl: './datepicker-wrapper.html',
})
export class DatepickerWrapperComponent {
    @Input() data: DatepickerWrapperData;

    @Input() emit: any;

    onClick(payload) {
      if (!this.emit) return;
      this.emit('click', payload);
    }

    toggleDropDown(payload) {
      if (!this.emit) return;
      this.emit('toggle', payload);
    }
}
