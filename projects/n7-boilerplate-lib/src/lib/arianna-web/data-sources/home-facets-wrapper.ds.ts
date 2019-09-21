import { DataSource } from '@n7-frontend/core';

export class AwHomeFacetsWrapperDS extends DataSource {

  protected transform(data) {
    return data.map(facet => ({
      iconLeft: facet.type.icon,
      text: facet.type.label,
      additionalText: facet.count,
      iconRight: ( facet.enabled ? 'n7-icon-eye' : 'n7-icon-eye-slash' ),
      classes: '',
      payload: facet.type.id,
    }))
  }

}