import { DataSource } from '@net7/core';
import { ButtonData } from '@net7/components';

export class MrButtonDS extends DataSource {
  protected transform(): ButtonData {
    const { text, link } = this.options;
    return {
      text: text || 'Button',
      anchor: {
        href: link || '#'
      }
    };
  }
}
