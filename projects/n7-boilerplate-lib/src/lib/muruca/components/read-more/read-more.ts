//---------------------------
// ReadMore.ts
//---------------------------

import {
  Component, Input, AfterViewInit, ViewChild, ElementRef
} from '@angular/core';

@Component({
  selector: 'mr-read-more',
  templateUrl: './read-more.html',
})
export class ReadMoreComponent implements AfterViewInit {
  @Input() data: any;

  @Input() emit: any;

  // Root div
  @ViewChild('root', { read: ElementRef }) root: ElementRef;

  // @ViewChild('content', { read: ElementRef }) content: ElementRef;

  collapsed: false;

  _loaded = false;

  ngAfterViewInit(): void {
  //   if (this._loaded) return;
  //   if (this.root) {
  //     this._loaded = true;
  //     console.log('height is:', this.root.nativeElement.clientHeight);
  //   }
  }

  onClick(type, payload) {
    this.emit(type, payload);
  }
}
