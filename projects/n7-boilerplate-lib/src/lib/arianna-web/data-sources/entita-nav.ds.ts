import { DataSource } from '@n7-frontend/core';

export class AwEntitaNavDS extends DataSource {
  public hasFields = false;

  protected transform(param): any {
    if (!param) {
      return null;
    }
    const { data } = param;
    const { selected } = param;
    const navigation = { items: [], payload: 'entita-nav' };
    const { config } = this.options;
    const metadataToShow = (config || {})['metadata-to-show'];
    this.hasFields = data.fields && data.fields.length > 0;

    if (this.hasFields && (Array.isArray(metadataToShow) && metadataToShow.length)) {
      this.hasFields = data.fields
        .filter((el) => metadataToShow.indexOf(el.key) !== -1)
        .length > 0;
    }

    navigation.items.push({
      text: 'OVERVIEW',
      anchor: { href: `${param.basePath}/overview` },
      classes: selected === 'overview' ? 'is-selected' : '',
    });
    if (this.hasFields) {
      navigation.items.push({
        text: 'CAMPI',
        anchor: { href: `${param.basePath}/campi` },
        classes: selected === 'campi' ? 'is-selected' : '',
      });
    }
    if (data.relatedItems) {
      navigation.items.push({
        text: 'OGGETTI COLLEGATI',
        anchor: {
          href: `${param.basePath}/oggetti-collegati`,
          queryParams: {
            page: 1,
          },
        },
        classes: selected === 'oggetti-collegati' ? 'is-selected' : '',
      });
    }
    if (data.relatedEntities && this.options.bubblesEnabled) {
      navigation.items.push({
        text: 'ENTITÀ COLLEGATE',
        anchor: { href: `${param.basePath}/entita-collegate` },
        classes: selected === 'entita-collegate' ? 'is-selected' : '',
      });
    }
    if (data.extraTab) {
      navigation.items.push({
        text: 'MAXXI',
        anchor: { href: `${param.basePath}/maxxi` },
        classes: selected === 'maxxi' ? 'is-selected' : '',
      });
    }
    if (data.wikiTab) {
      navigation.items.push({
        text: 'WIKIPEDIA',
        anchor: { href: `${param.basePath}/wiki` },
        classes: selected === 'wiki' ? 'is-selected' : '',
      });
    }

    return navigation;
  }
}
