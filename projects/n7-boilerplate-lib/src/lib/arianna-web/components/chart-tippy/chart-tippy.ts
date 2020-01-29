//---------------------------
// ChartTippy.ts
//---------------------------

import { Component, Input } from '@angular/core';

@Component({
  selector: 'aw-chart-tippy',
  templateUrl: './chart-tippy.html'
})
export class ChartTippyComponent {
  @Input() data: any;
  @Input() emit: any;
  @Input() anchorData: any;

  onClick(type, payload) {
    this.emit(type, payload);
  }
}