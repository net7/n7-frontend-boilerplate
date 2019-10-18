//---------------------------
// BubbleChartWrapper.ts
//---------------------------

import { Component, Input } from '@angular/core';

@Component({
  selector: 'aw-bubble-chart-wrapper',
  templateUrl: './bubble-chart-wrapper.html'
})
export class BubbleChartWrapperComponent {
  @Input() hover: any;
  @Input() emit: any;
  @Input() container: string;

  onClick(type, payload) {
    this.emit(type, payload);
  }
}
