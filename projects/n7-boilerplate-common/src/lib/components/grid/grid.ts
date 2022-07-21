import { Component, Input } from '@angular/core';

@Component({
  selector: 'grid',
  templateUrl: './grid.html',
})

export class SmartPaginationComponent {
  /**
   * Sets the grid-template-column css attribute
   * defines the width of each column.
   *
   * https://developer.mozilla.org/en-US/docs/Web/CSS/grid-template-columns
   */
  @Input() templateColumns: string;

  /**
   * Sets the amount of columns to render.
   */
  @Input() columns: number;
}
