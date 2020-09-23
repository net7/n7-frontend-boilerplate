import { DataSource } from '@n7-frontend/core';
import { TagData } from '@n7-frontend/components';

export class MrSearchTagsDS extends DataSource {
  public hasFilters = false;

  protected transform(data): TagData[] {
    const { state, linksResponse, facetsConfig } = data;
    const { facets } = linksResponse;
    const tags = [];

    // inputs config
    facetsConfig.sections.forEach(({ inputs }) => {
      inputs
        .filter(({ queryParam }) => queryParam)
        .forEach(({ id }) => {
          if (state[id]) {
            const values = Array.isArray(state[id]) ? state[id] : [state[id]];
            values
              .forEach((value) => {
                let text = value;
                if (facets[id]) {
                  const selectedFacet = facets[id].values.find(({ payload }) => payload === value);
                  if (selectedFacet) {
                    text = selectedFacet.text;
                  }
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

    this.hasFilters = !!tags.length;
    return tags;
  }
}
