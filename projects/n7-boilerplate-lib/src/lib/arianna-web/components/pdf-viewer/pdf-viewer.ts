//---------------------------
// PdfViewer.ts
//---------------------------

import { Component, Input } from '@angular/core';

export type PdfViewerData = {
  url: string;
}

@Component({
  selector: 'aw-pdf-viewer',
  templateUrl: './pdf-viewer.html',
})
export class PdfViewerComponent {
  @Input() data: PdfViewerData;
}
