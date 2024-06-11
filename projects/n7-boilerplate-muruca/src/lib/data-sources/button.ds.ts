import { DataSource } from '@net7/core';
import { ButtonData } from '@net7/components';

export class MrButtonDS extends DataSource {
  protected transform(): ButtonData {
    const {
      iconLeft, iconRight
    } = this.options;
    return {
      text: 'Scarica PDF',
      iconLeft,
      iconRight,
      classes: 'n7-btn',
      anchor: {
        payload: 'get-pdf-click',
      }
    };
  }
}
