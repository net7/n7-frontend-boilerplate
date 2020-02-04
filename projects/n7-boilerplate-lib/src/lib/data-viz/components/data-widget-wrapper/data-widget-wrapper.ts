import { Component, Input } from '@angular/core';

export interface IDataWidgetWrapperData {
    classes?: string;
}

@Component({
    selector: 'dv-data-widget-wrapper',
    templateUrl: './data-widget-wrapper.html'
})
export class DataWidgetWrapperComponent{
    @Input() data: IDataWidgetWrapperData;
}
