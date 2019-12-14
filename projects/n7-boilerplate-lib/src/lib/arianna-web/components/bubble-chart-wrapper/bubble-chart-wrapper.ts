//---------------------------
// BubbleChartWrapper.ts
//---------------------------

import { Component, Input } from '@angular/core';
// import { IBubbleChartWrapperData } from '@n7-frontend/components';
export interface IBubbleChartWrapperData {
  /**
   * When set to true, returns the tippy template for the basic
   * version of the graph. (without the select button)
   */
  simple?: boolean
}

@Component({
  selector: 'aw-bubble-chart-wrapper',
  templateUrl: './bubble-chart-wrapper.html'
})
export class BubbleChartWrapperComponent {
  @Input() data: IBubbleChartWrapperData;
  @Input() emit: any;
  @Input() container: string;
  @Input() buttons: any;

  onClick(type, payload) {
    this.emit(type, payload);
  }
}