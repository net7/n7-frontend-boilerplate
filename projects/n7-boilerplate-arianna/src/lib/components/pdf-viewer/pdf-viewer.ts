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
  libOptions: {
    showToolbar: boolean;
    showSidebarButton: boolean;
    showFindButton: boolean;
    showPagingButtons: boolean;
    showZoomButtons: boolean;
    showPresentationModeButton: boolean;
    showOpenFileButton: boolean;
    showPrintButton: boolean;
    showDownloadButton: boolean;
    showBookModeButton: boolean;
    showSecondaryToolbarButton: boolean;
    showRotateButton: boolean;
    showHandToolButton: boolean;
    showScrollingButton: boolean;
    showSpreadButton: boolean;
    showPropertiesButton: boolean;
  };
  classes?: string;
}

@Component({
  selector: 'aw-pdf-viewer',
  templateUrl: './pdf-viewer.html',
})
export class PdfViewerComponent {
  @Input() data: PdfViewerData;

  @Input() emit: (type: string, payload?: any) => void;

  onClick(payload) {
    if (!this.emit || isNull(payload)) {
      return;
    }

    this.emit('click', payload);
  }

  onLoaded() {
    this.emit('loaded');
  }
}
