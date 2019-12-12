import { Component, Input } from '@angular/core';

export interface ISelectData{
    id: string,
    options: SelectOptions[],
    classes?: string,
}
export interface SelectOptions {
    text: string,
    payload: any,
    classes?: string,
}


@Component({
    selector: 'dv-datepicker-wrapper',
    templateUrl: './datepicker-wrapper.html'
})
export class DatePikerWrapperComponent{
    @Input() data: ISelectData;
    @Input() emit: any;

}
  