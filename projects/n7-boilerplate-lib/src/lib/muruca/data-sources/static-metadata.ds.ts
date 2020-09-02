import { DataSource, _t } from '@n7-frontend/core';
import dateHelper from '../helpers/date-helper';

export class MrStaticMetadataDS extends DataSource {
  protected transform(data: any): any {
    const items = ['authors', 'date', 'time_to_read']
      .filter((metakey) => data[metakey])
      .map((metakey) => {
        const itemValue = metakey === 'date' ? dateHelper.format(data[metakey], _t('global#date_human')) : data[metakey];
        if (metakey === 'time_to_read') {
          return {
            value: _t(
              `resource#${metakey}`,
              { value: itemValue },
              (key, placeholders) => (placeholders.value === 1 ? `${key}_1` : key)
            )
          };
        }
        return {
          value: _t(`resource#${metakey}`, { value: itemValue })
        };
      });

    return { group: [{ items }] };
  }
}
