import { Component, Input } from '@angular/core';

export interface IDatePickerLabelData {
    select: IDatePickerSelect,
    datepicker: any;
}

export interface IDatePickerSelect {
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
export class DatePikerWrapperComponent{
    @Input() data: IDatePickerLabelData;
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

    // closeDatepicker(){
    //     if(!this.emit) return;
    //     this.emit('close-datepicker', false);
    // }

}
  