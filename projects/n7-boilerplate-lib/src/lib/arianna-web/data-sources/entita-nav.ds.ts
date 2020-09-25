import { DataSource } from '@n7-frontend/core';

export class AwEntitaNavDS extends DataSource {
  protected transform(param): any {
    if (!param) {
      return null;
    }
    const { data, selected } = param;
    const navigation = { items: [], payload: 'entita-nav' };
    const { hasMetadataFields, labels } = this.options;

    /* navigation.items.push({
      text: 'OVERVIEW',
      anchor: { href: `${param.basePath}/overview` },
      classes: selected === 'overview' ? 'is-selected overview-tab' : 'overview-tab',
    });
    if (hasMetadataFields) {
      navigation.items.push({
        text: 'INFORMAZIONI',
        anchor: { href: `${param.basePath}/informazioni` },
        classes: selected === 'informazioni' ? 'is-selected' : '',
      });
    } */
    navigation.items.push({
      text: 'INFORMAZIONI',
      anchor: { href: `${param.basePath}/informazioni` },
      classes: selected === 'informazioni' ? 'is-selected' : '',
    });
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
    if (data.relatedEntities) {
      navigation.items.push({
        text: 'ENTITÀ COLLEGATE',
        anchor: { href: `${param.basePath}/entita-collegate` },
        classes: selected === 'entita-collegate' ? 'is-selected' : '',
      });
    }
    if (data.relatedLa) {
      navigation.items.push({
        text: labels['aggregazioni-logiche-collegate'],
        anchor: { href: `${param.basePath}/fondi-collegati` },
        classes: selected === 'fondi-collegati' ? 'is-selected' : '',
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

    // one tab control
    if (navigation.items.length === 2 && !hasMetadataFields) {
      navigation.items.shift();
    }

    return navigation;
  }
}
