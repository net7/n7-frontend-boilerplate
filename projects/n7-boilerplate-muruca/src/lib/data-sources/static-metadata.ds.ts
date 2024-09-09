import { DataSource, _t } from '@net7/core';
import dateHelper from '../helpers/date-helper';

export class MrStaticMetadataDS extends DataSource {
  protected transform(data: any): any {
    const items = ['authors', 'author', 'date', 'doi', 'time_to_read']
      .filter((metakey) => data[metakey])
      .map((metakey) => {
        const itemValue = metakey === 'date' ? dateHelper.format(data[metakey], _t('global#date_human')) : data[metakey];
        return {
          group: [
            {
              items: [{
                label: _t(`resource#${metakey}`),
                value: itemValue
              }]
            }
          ]
        };
      });
    return { group: items };
  }
}
