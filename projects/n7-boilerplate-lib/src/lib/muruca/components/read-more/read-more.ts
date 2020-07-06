//---------------------------
// ReadMore.ts
//---------------------------

import {
  Component, Input, AfterViewChecked, ViewChild, ElementRef
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'mr-read-more',
  templateUrl: './read-more.html',
})
export class ReadMoreComponent implements AfterViewChecked {
  @Input() data: any;

  @Input() emit: any;

  // Root div
  @ViewChild('root', { read: ElementRef }) root: ElementRef;

  // CSS Classes
  state: 'is-expanded' | 'is-collapsed' = 'is-expanded'

  collapsed = new BehaviorSubject(false);

  _loaded = false;

  /**
   * Determine if the view is taller than the given height limit,
   * if it is, render the "Read-more" button.
   */
  ngAfterViewChecked(): void {
    if (this._loaded) return;
    if (this.root && this.root.nativeElement.clientHeight > 0) {
      this._loaded = true;
      const height = (this.root.nativeElement as HTMLElement).clientHeight;
      const { limit } = this.data;
      this.data.height = height;
      if (height > limit) {
        setTimeout(() => {
          this.toggleClass();
          this.collapsed.next(true);
        });
      }
    }
  }

  toggleClass() {
    if (this.state === 'is-collapsed') this.state = 'is-expanded';
    if (this.state === 'is-expanded') this.state = 'is-collapsed';
  }

  handleToggle() {
    const v = this.collapsed.value;
    this.collapsed.next(!v);
  }

  // onClick(type, payload) {
  //   if (!this.emit) return;
  //   this.emit(type, payload);
  // }
}
