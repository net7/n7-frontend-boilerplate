import { DataSource } from '@n7-frontend/core';

export class MrSearchPageTitleDS extends DataSource {
  protected transform() {
    const { title } = this.options.config;

    return {
      title: {
        main: {
          text: title
        }
      }
    };
  }
}
