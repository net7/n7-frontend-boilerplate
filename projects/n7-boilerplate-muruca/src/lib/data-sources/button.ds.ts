import { DataSource } from '@net7/core';
import { ButtonData } from '@net7/components';

export class MrButtonDS extends DataSource {
  protected transform(data: any): ButtonData {
    if (!data) return null;
    return {
      text: 'Download PDF',
      anchor: {
        payload: 'download-pdf',
      }
    };
  }
}
