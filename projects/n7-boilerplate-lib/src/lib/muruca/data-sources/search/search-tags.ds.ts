import { DataSource } from '@n7-frontend/core';
import { TagData } from '@n7-frontend/components';

export class MrSearchTagsDS extends DataSource {
  protected transform(data): TagData[] {
    const { state, linksResponse, facetsConfig } = data;
    const { inputs: linkInputs } = linksResponse;
    const tags = [];

    // inputs config
    facetsConfig.sections.forEach(({ inputs }) => {
      inputs
        .filter(({ queryParam }) => queryParam)
        .forEach(({ id }) => {
          if (state[id]) {
            const values = Array.isArray(state[id]) ? state[id] : [state[id]];
            values.forEach((value) => {
              let text = value;
              if (linkInputs[id]) {
                text = linkInputs[id].find(({ payload }) => payload === value).text;
              }
              tags.push({
                text,
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
