import { DataSource } from '@net7/core';

export class DvInnerTitleDS extends DataSource {
  protected transform() {
    return {
      title: {
        main: {
          text: 'Dipendenti',
          classes: 'n7-main-widget-title',
        },
        secondary: {
          text: 'Dipendeti al 10/10/10',
          classes: 'n7-secondary-widget-title',
        },
      },
    };
  }
}
