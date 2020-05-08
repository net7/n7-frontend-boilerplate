import { DataSource } from '@n7-frontend/core';

export class MrSearchPageTitleDS extends DataSource {
  protected transform({ title }) {
    return {
      title: {
        main: {
          text: title
        }
      }
    };
  }
}
