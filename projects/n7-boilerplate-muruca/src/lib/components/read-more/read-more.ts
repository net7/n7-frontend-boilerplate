//---------------------------
// ReadMore.ts
//---------------------------

import {
  Component, Input, AfterViewChecked, ViewChild, ElementRef
} from '@angular/core';
import { _t } from '@net7/core';

export type ReadMoreData = {
  height: number;
  labels: {
    more: string;
    less: string;
  };
};

const HEIGHT_MARGIN = 50;

@Component({
  selector: 'mr-read-more',
  templateUrl: './read-more.html',
})
export class ReadMoreComponent implements AfterViewChecked {
  @Input() data: ReadMoreData;

  // Root div
  @ViewChild('root', { read: ElementRef }) root: ElementRef;

  collapsed = true;

  hasReadmore = false;

  wrapperHeight: number;

  clientHeight: number;

  _loaded = false;

  /**
   * Determine if the view is taller than the given height limit,
   * if it is, render the "Read-more" button.
   */
  ngAfterViewChecked(): void {
    if (this._loaded || !this.data) return;
    if (this.root && this.root.nativeElement.clientHeight > 0) {
      this._loaded = true;
      this.clientHeight = (this.root.nativeElement as HTMLElement).clientHeight;
      const { height, labels } = this.data;

      // translate labels
      Object.keys(labels).forEach((key) => {
        this.data.labels[key] = _t(labels[key]);
      });

      if (this.clientHeight > (height + HEIGHT_MARGIN)) {
        setTimeout(() => {
          this.hasReadmore = true;
          this.updateWrapperHeight();
        });
      }
    }
  }

  handleToggle() {
    this.collapsed = !this.collapsed;
    this.updateWrapperHeight();
  }

  updateWrapperHeight() {
    this.wrapperHeight = this.collapsed
      ? this.data.height
      : this.clientHeight;
  }
}
