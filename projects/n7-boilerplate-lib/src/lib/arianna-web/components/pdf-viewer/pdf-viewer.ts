//---------------------------
// PdfViewer.ts
//---------------------------

import { Component, Input } from '@angular/core';
import { isNull } from 'lodash';

export type PdfViewerData = {
  items: {
    label: string;
    url: string;
    selected: boolean;
  }[];
  next: number | null;
  prev: number | null;
  currentUrl: string;
}

@Component({
  selector: 'aw-pdf-viewer',
  templateUrl: './pdf-viewer.html',
})
export class PdfViewerComponent {
  @Input() data: PdfViewerData;

  @Input() emit: (type: string, payload: any) => void;

  onClick(payload) {
    if (!this.emit || isNull(payload)) {
      return;
    }

    this.emit('click', payload);
  }
}
