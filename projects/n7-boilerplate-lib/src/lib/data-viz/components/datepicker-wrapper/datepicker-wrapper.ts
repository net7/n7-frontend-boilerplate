import { Component, Input } from '@angular/core';

export interface IDatepickerLabelData {
    select: IDatepickerSelect,
    datepicker: any;
}

export interface IDatepickerSelect {
    id: string,
    hidden: boolean,
    icon?: string,
    label: string,
    items: ILabelItems[],
    classes?: string,
}

export interface ILabelItems {
    text: string,
    payload: any,
    classes?: string,
}

@Component({
    selector: 'dv-datepicker-wrapper',
    templateUrl: './datepicker-wrapper.html',
})
export class DatepickerWrapperComponent{
    @Input() data: IDatepickerLabelData;
    @Input() emit: any;
    @Input() show: any;
    @Input() label: string;

    onClick(payload) {
        if(!this.emit) return;
        this.emit('click', payload);
    }

    openDropDown() {
        if(!this.emit) return;
        this.emit('open', true);
    }

}
  