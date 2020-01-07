import { Component, Input } from '@angular/core';

export interface IDatepickerWrapperData {
    select: ISelect,
    datepicker: any;
    payload?: any;
}

interface ISelect {
    id: string,
    hidden: boolean,
    icon?: string,
    label: string,
    items: IDropdownItems[],
    classes?: string,
}

interface IDropdownItems {
    text: string,
    payload: any,
    classes?: string,
}

@Component({
    selector: 'dv-datepicker-wrapper',
    templateUrl: './datepicker-wrapper.html',
})
export class DatepickerWrapperComponent{
    @Input() data: IDatepickerWrapperData;
    @Input() emit: any;

    onClick(payload) {
        if(!this.emit) return;
        this.emit('click', payload);
    }

    toggleDropDown(payload) {
        if(!this.emit) return;
        this.emit('toggle', payload);
    }

}
  