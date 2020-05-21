import { DataSource } from '@n7-frontend/core';
import { TagData } from '@n7-frontend/components';

export class MrSearchTagsDS extends DataSource {
  protected transform(data): TagData[] {
    const { state, facetsConfig } = data;
    const tags = [];

    // inputs config
    facetsConfig.sections.forEach(({ inputs }) => {
      inputs
        .filter(({ queryParam }) => queryParam)
        .forEach(({ id }) => {
          if (state[id]) {
            const values = Array.isArray(state[id]) ? state[id] : [state[id]];
            values.forEach((value) => {
              tags.push({
                text: value,
                icon: 'n7-icon-close',
                payload: {
                  id,
                  value
                }
              });
            });
          }
        });
    });
    return tags;
  }
}
