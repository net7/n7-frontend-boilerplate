import { InnerTitleData } from '@net7/components';
import { DataSource, _t } from '@net7/core';

export class MrSearchPageTitleDS extends DataSource {
  protected transform(): InnerTitleData {
    const { title, description, searchId } = this.options.config;
    const data: InnerTitleData = {
      title: {
        main: {
          text: _t(title)
        }
      }
    };

    if (description && description.buttonText) {
      data.actions = {
        buttons: [{
          text: _t(description.buttonText),
          anchor: {
            payload: searchId
          }
        }]
      };
    }

    return data;
  }
}
