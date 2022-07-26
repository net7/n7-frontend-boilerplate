import { Component, Input } from '@angular/core';

@Component({
  selector: 'side-scroller',
  templateUrl: './side-scroller.html',
})

export class SideScrollerComponent {
  /**
   * Additional classes for the root element.
   */
   @Input() classes: string;
}
