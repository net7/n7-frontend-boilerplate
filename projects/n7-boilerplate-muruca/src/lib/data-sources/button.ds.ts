import { DataSource } from '@net7/core';
import { ButtonData } from '@net7/components';

export class MrButtonDS extends DataSource {
  protected transform(): ButtonData {
    const {
      text, link, iconLeft, iconRight
    } = this.options;
    return {
      text: text || 'Button',
      iconLeft: iconLeft || null,
      iconRight: iconRight || null,
      anchor: {
        href: link || '#'
      }
    };
  }
}
