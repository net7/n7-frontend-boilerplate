//---------------------------
// PdfViewer.ts
//---------------------------

import {
  Component, Input, OnDestroy, OnInit
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export type PdfViewerData = {
  items: string[];
}

@Component({
  selector: 'aw-pdf-viewer',
  templateUrl: './pdf-viewer.html',
})
export class PdfViewerComponent implements OnInit, OnDestroy {
  @Input() data$: Observable<PdfViewerData>;

  private destroy$: Subject<void> = new Subject();

  items: string[];

  src: string;

  next: number | null;

  prev: number | null;

  current: number;

  hasNavigation: boolean;

  ngOnInit() {
    this.data$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(({ items }: PdfViewerData) => {
      this.items = items;
      // defaults
      this.current = 0;
      this.hasNavigation = items.length > 1;
      this.prev = null;
      this.next = this.current + 1;
      [this.src] = items;
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
  }
}
