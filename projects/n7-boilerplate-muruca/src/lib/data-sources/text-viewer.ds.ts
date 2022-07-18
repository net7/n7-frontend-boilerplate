import { TextViewerData } from '@net7/components';
import { DataSource } from '@net7/core';

export class MrTextViewerDS extends DataSource {
  id: string;

  protected transform(data: TextViewerData): TextViewerData {
    // force tei publisher endpoint value
    document.addEventListener('pb-page-ready', (ev: CustomEvent) => {
      const { detail } = ev;
      detail.endpoint = data.endpoint;
    }, { once: true });

    return data;
  }
}
