import { Component, Input } from '@angular/core';

@Component({
  selector: 'n7-grid',
  templateUrl: './grid.html',
})

export class GridComponent {
  /**
   * Sets the grid-template-column css attribute
   * defines the width of each column.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns
   */
  @Input() templateColumns: string;

  /**
   * Additional classes for the root element.
   */
  @Input() classes: string;
}
